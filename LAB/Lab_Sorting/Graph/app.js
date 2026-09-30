/**
 * Sorting Benchmark & Visualizer - Logic, Animation & Chart Management
 * ENGSE216 - Data Structures & Algorithms
 */

// =============================================================================
// JAVA 48-BIT LCG RANDOM (Matches java.util.Random(42L) 100% identically)
// =============================================================================
class JavaRandom {
    constructor(seed = 42) {
        this.seed = (BigInt(seed) ^ 0x5DEECE66Dn) & ((1n << 48n) - 1n);
    }
    next(bits) {
        this.seed = (this.seed * 0x5DEECE66Dn + 0xBn) & ((1n << 48n) - 1n);
        return Number(this.seed >> (48n - BigInt(bits)));
    }
    nextInt(bound) {
        let r = this.next(31);
        let m = bound - 1;
        if ((bound & m) === 0) {
            r = Number((BigInt(bound) * BigInt(r)) >> 31n);
        } else {
            let u = r;
            while (u - (r = u % bound) + m < 0) {
                u = this.next(31);
            }
        }
        return r;
    }
}

// =============================================================================
// 1. BENCHMARK GRAPH LOGIC (Chart.js & Data Parsing)
// =============================================================================

const SAMPLE_BENCHMARK_DATA = [
    { n: 500, bubble: 2.2905, selection: 0.9680, insertion: 0.8999, quick: 0.1405 },
    { n: 1000, bubble: 1.3513, selection: 1.1204, insertion: 0.6889, quick: 0.0805 },
    { n: 10000, bubble: 28.2893, selection: 13.7192, insertion: 15.7981, quick: 0.7633 },
    { n: 50000, bubble: 1946.1939, selection: 434.1029, insertion: 353.0402, quick: 2.3702 },
    { n: 100000, bubble: 8438.9642, selection: 1714.1976, insertion: 498.2555, quick: 4.9697 }
];

let userBenchmarkData = [
    { n: 500, bubble: 2.2905, selection: 0.9680, insertion: 0.8999, quick: 0.1405 },
    { n: 1000, bubble: 1.3513, selection: 1.1204, insertion: 0.6889, quick: 0.0805 },
    { n: 10000, bubble: 28.2893, selection: 13.7192, insertion: 15.7981, quick: 0.7633 },
    { n: 50000, bubble: 1946.1939, selection: 434.1029, insertion: 353.0402, quick: 2.3702 },
    { n: 100000, bubble: 8438.9642, selection: 1714.1976, insertion: 498.2555, quick: 4.9697 }
];

let currentDataSource = 'user';
let selectedNSizes = new Set([500, 1000, 10000, 50000, 100000]);

const ALGO_CONFIG = {
    bubble: {
        id: 'bubble',
        name: 'Bubble Sort',
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.12)',
        borderColor: '#f59e0b',
        pointBorderColor: '#fbbf24',
        complexity: 'O(n²)'
    },
    selection: {
        id: 'selection',
        name: 'Selection Sort',
        color: '#a855f7',
        bgColor: 'rgba(168, 85, 247, 0.12)',
        borderColor: '#a855f7',
        pointBorderColor: '#c084fc',
        complexity: 'O(n²)'
    },
    insertion: {
        id: 'insertion',
        name: 'Insertion Sort',
        color: '#06b6d4',
        bgColor: 'rgba(6, 182, 212, 0.12)',
        borderColor: '#06b6d4',
        pointBorderColor: '#38bdf8',
        complexity: 'O(n²)'
    },
    quick: {
        id: 'quick',
        name: 'Quick Sort',
        color: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.12)',
        borderColor: '#10b981',
        pointBorderColor: '#34d399',
        complexity: 'O(n log n)'
    }
};

let chartInstance = null;
let currentScaleType = 'linear';
let currentFilter = 'all';

// =============================================================================
// 2. SORTING ANIMATION STATE & CONFIGURATION
// =============================================================================

let animSource = 'sample'; // 'sample' (Demo) or 'user' (Real Data)
let userSelectedN = 500;   // 500, 1000, 10000, 50000, 100000
let userDataType = 'seed'; // 'seed' (Java seed=42) or 'custom'
let customArrayData = [];

let animRunning = false;
let animPaused = false;
let animMode = 'grid'; // 'grid' (4-in-1) or 'single'
let activeSingleAlgo = 'bubble';
let arraySize = 40;
let animSpeed = 85;
let audioEnabled = true;
let animFrameId = null;

let masterArray = [];

// Per-algorithm state
const algosState = {
    bubble: { arr: [], gen: null, done: false, comp: 0, swap: 0, progress: 0, startTime: 0, elapsed: 0, highlights: {} },
    selection: { arr: [], gen: null, done: false, comp: 0, swap: 0, progress: 0, startTime: 0, elapsed: 0, highlights: {} },
    insertion: { arr: [], gen: null, done: false, comp: 0, swap: 0, progress: 0, startTime: 0, elapsed: 0, highlights: {} },
    quick: { arr: [], gen: null, done: false, comp: 0, swap: 0, progress: 0, startTime: 0, elapsed: 0, highlights: {} }
};

let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioCtx = new AudioContext();
        }
    }
}

function playTone(val, maxVal) {
    if (!audioEnabled || !audioCtx || arraySize > 300) return; // Mute for massive arrays
    try {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const freq = 160 + (val / maxVal) * 800;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.035);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.035);
    } catch (e) {
        // Fallback
    }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    initViewSwitching();
    initBenchmarkSourceSwitching();
    initBenchmarkNSizePills();
    renderActiveBenchmarkTable();
    initBenchmarkEventListeners();
    initQuickPasteHandler();
    initHistoryListeners();
    generateChart();

    // Init Animation
    initAnimationCanvases();
    initAnimationSourceControls();
    resetAnimationData();
    initAnimationEventListeners();
});

// Top Navigation Switching
function initViewSwitching() {
    const navBtns = document.querySelectorAll('.nav-tab-btn');
    const viewPanels = document.querySelectorAll('.view-panel');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetView = btn.dataset.view;

            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            viewPanels.forEach(panel => {
                if (panel.id === `view-${targetView}`) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });

            if (targetView === 'animation') {
                adjustCanvasSizes();
                renderAllCanvases();
            } else if (targetView === 'benchmark') {
                if (chartInstance) {
                    chartInstance.resize();
                }
            }
        });
    });
}

// =============================================================================
// ANIMATION DATA SOURCE CONTROLS (ตัวอย่าง vs ข้อมูลจริงของ User)
// =============================================================================

function updateAnimationSizeBadge() {
    const badge = document.getElementById('user-active-n-badge');
    const userBox = document.getElementById('user-size-info-box');
    const sampleBox = document.getElementById('sample-size-slider-box');

    if (animSource === 'sample') {
        if (sampleBox) sampleBox.style.display = 'flex';
        if (userBox) userBox.style.display = 'none';
    } else {
        if (sampleBox) sampleBox.style.display = 'none';
        if (userBox) userBox.style.display = 'flex';
        if (badge) {
            if (userDataType === 'seed') {
                badge.textContent = `N = ${userSelectedN.toLocaleString()} (Seed: 42)`;
            } else {
                const count = customArrayData.length || userSelectedN;
                badge.textContent = `N = ${count.toLocaleString()} (ตัวเลขของฉัน)`;
            }
        }
    }
}

function initAnimationSourceControls() {
    const tabSample = document.getElementById('tab-anim-sample');
    const tabUser = document.getElementById('tab-anim-user');
    const userPanel = document.getElementById('user-anim-panel');
    const sampleSliderBox = document.getElementById('sample-size-slider-box');

    // Switch to Sample Demo Mode
    tabSample.addEventListener('click', () => {
        if (animSource === 'sample') return;
        animSource = 'sample';
        tabSample.classList.add('active');
        tabUser.classList.remove('active');
        userPanel.style.display = 'none';
        arraySize = parseInt(document.getElementById('size-slider').value) || 40;
        updateAnimationSizeBadge();
        resetAnimationData();
        showToast('สลับไปยัง: แอนิเมชันชุดตัวอย่างจำลอง 💡');
    });

    // Switch to Real User Data Mode
    tabUser.addEventListener('click', () => {
        if (animSource === 'user') return;
        animSource = 'user';
        tabUser.classList.add('active');
        tabSample.classList.remove('active');
        userPanel.style.display = 'block';
        arraySize = (userDataType === 'custom' && customArrayData.length >= 2) ? customArrayData.length : userSelectedN;
        updateAnimationSizeBadge();
        resetAnimationData();
        showToast(`สลับไปยัง: แอนิเมชันข้อมูลจริง (N = ${arraySize.toLocaleString()}) ⚡`);
    });

    // User N Presets (500, 1000, 10000, 50000, 100000)
    const nPills = document.querySelectorAll('#anim-user-n-pills .anim-n-pill');
    nPills.forEach(pill => {
        pill.addEventListener('click', () => {
            nPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            userSelectedN = parseInt(pill.dataset.n);
            userDataType = 'seed';
            document.getElementById('btn-dataset-seed').classList.add('active');
            document.getElementById('btn-dataset-custom').classList.remove('active');
            document.getElementById('custom-array-input-row').style.display = 'none';
            arraySize = userSelectedN;
            updateAnimationSizeBadge();
            resetAnimationData();
            showToast(`เลือกขนาดข้อมูลจริง N = ${userSelectedN.toLocaleString()} (สุ่มตาม Java Seed=42) 🎯`);
        });
    });

    // Dataset Source Toggle: Seed vs Custom
    const btnSeed = document.getElementById('btn-dataset-seed');
    const btnCustom = document.getElementById('btn-dataset-custom');
    const customRow = document.getElementById('custom-array-input-row');

    btnSeed.addEventListener('click', () => {
        btnSeed.classList.add('active');
        btnCustom.classList.remove('active');
        customRow.style.display = 'none';
        userDataType = 'seed';
        arraySize = userSelectedN;
        updateAnimationSizeBadge();
        resetAnimationData();
        showToast('ใช้ชุดข้อมูลสุ่ม Seed=42 เหมือนใน Java 🎲');
    });

    btnCustom.addEventListener('click', () => {
        btnCustom.classList.add('active');
        btnSeed.classList.remove('active');
        customRow.style.display = 'flex';
        userDataType = 'custom';
        const input = document.getElementById('custom-array-text');
        if (!input.value) {
            input.value = '45, 12, 89, 3, 27, 60, 15, 78, 92, 5, 33, 71, 18, 54, 82';
        }
        input.focus();
        updateAnimationSizeBadge();
    });

    // Apply custom array
    document.getElementById('btn-apply-custom-array').addEventListener('click', () => {
        const text = document.getElementById('custom-array-text').value;
        const nums = text.split(/[\s,]+/).map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
        if (nums.length >= 2) {
            customArrayData = nums;
            arraySize = nums.length;
            updateAnimationSizeBadge();
            resetAnimationData();
            showToast(`นำเข้าตัวเลขกำหนดเองสำเร็จ ${nums.length} รายการ ✍️`);
        } else {
            showToast('⚠️ กรุณากรอกตัวเลขคั่นด้วยจุลภาคอย่างน้อย 2 ตัวเลข');
        }
    });

    updateAnimationSizeBadge();
}

// Generate array based on active animation mode
function generateActiveAnimationArray() {
    if (animSource === 'sample') {
        // Sample array: 1 to arraySize shuffled
        const arr = [];
        for (let i = 1; i <= arraySize; i++) arr.push(i);
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    } else {
        // User Mode
        if (userDataType === 'custom' && customArrayData.length >= 2) {
            return [...customArrayData];
        } else {
            // Exact Java Random(42L)
            const rng = new JavaRandom(42);
            const arr = new Array(arraySize);
            for (let i = 0; i < arraySize; i++) {
                arr[i] = rng.nextInt(1000000);
            }
            return arr;
        }
    }
}

// =============================================================================
// SORTING ALGORITHM STEP GENERATORS (function*)
// =============================================================================

function* bubbleSortGen(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - 1 - i; j++) {
            yield { type: 'compare', indices: [j, j + 1], val: arr[j], prog: (i / (n - 1)) * 100 };
            if (arr[j] > arr[j + 1]) {
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                yield { type: 'swap', indices: [j, j + 1], val: arr[j + 1], prog: (i / (n - 1)) * 100 };
            }
        }
        yield { type: 'sorted', index: n - 1 - i, prog: ((i + 1) / (n - 1)) * 100 };
    }
    yield { type: 'sorted', index: 0, prog: 100 };
    yield { type: 'done', prog: 100 };
}

function* selectionSortGen(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let min = i;
        yield { type: 'pivot', index: min, val: arr[min], prog: (i / (n - 1)) * 100 };
        for (let j = i + 1; j < n; j++) {
            yield { type: 'compare', indices: [j, min], val: arr[j], prog: (i / (n - 1)) * 100 };
            if (arr[j] < arr[min]) {
                min = j;
                yield { type: 'pivot', index: min, val: arr[min], prog: (i / (n - 1)) * 100 };
            }
        }
        if (min !== i) {
            const temp = arr[i];
            arr[i] = arr[min];
            arr[min] = temp;
            yield { type: 'swap', indices: [i, min], val: arr[i], prog: (i / (n - 1)) * 100 };
        }
        yield { type: 'sorted', index: i, prog: ((i + 1) / (n - 1)) * 100 };
    }
    yield { type: 'sorted', index: n - 1, prog: 100 };
    yield { type: 'done', prog: 100 };
}

function* insertionSortGen(arr) {
    const n = arr.length;
    yield { type: 'sorted', index: 0, prog: 0 };
    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        yield { type: 'pivot', index: i, val: key, prog: (i / (n - 1)) * 100 };
        while (j >= 0 && arr[j] > key) {
            yield { type: 'compare', indices: [j, j + 1], val: arr[j], prog: (i / (n - 1)) * 100 };
            arr[j + 1] = arr[j];
            yield { type: 'overwrite', index: j + 1, value: arr[j], val: arr[j], prog: (i / (n - 1)) * 100 };
            j--;
        }
        arr[j + 1] = key;
        yield { type: 'overwrite', index: j + 1, value: key, val: key, prog: (i / (n - 1)) * 100 };
        for (let k = 0; k <= i; k++) {
            yield { type: 'sorted', index: k, prog: (i / (n - 1)) * 100 };
        }
    }
    yield { type: 'done', prog: 100 };
}

function* quickSortGen(arr) {
    let sortedCount = 0;
    const n = arr.length;

    function* quickSortRec(l, r) {
        if (l < r) {
            const pivotVal = arr[l];
            yield { type: 'pivot', index: l, val: pivotVal, prog: (sortedCount / n) * 100 };
            let i = l;
            let j = r + 1;

            while (true) {
                do {
                    i++;
                    if (i <= r) yield { type: 'compare', indices: [i, l], val: arr[i], prog: (sortedCount / n) * 100 };
                } while (i <= r && arr[i] < pivotVal);

                do {
                    j--;
                    if (j >= l) yield { type: 'compare', indices: [j, l], val: arr[j], prog: (sortedCount / n) * 100 };
                } while (j >= l && arr[j] > pivotVal);

                if (i >= j) break;

                const temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                yield { type: 'swap', indices: [i, j], val: arr[j], prog: (sortedCount / n) * 100 };
            }

            const temp = arr[l];
            arr[l] = arr[j];
            arr[j] = temp;
            yield { type: 'swap', indices: [l, j], val: arr[l], prog: (sortedCount / n) * 100 };
            yield { type: 'sorted', index: j, prog: (sortedCount / n) * 100 };
            sortedCount++;

            yield* quickSortRec(l, j - 1);
            yield* quickSortRec(j + 1, r);
        } else if (l === r) {
            yield { type: 'sorted', index: l, prog: (sortedCount / n) * 100 };
            sortedCount++;
        }
    }

    yield* quickSortRec(0, n - 1);
    for (let i = 0; i < n; i++) {
        yield { type: 'sorted', index: i, prog: 100 };
    }
    yield { type: 'done', prog: 100 };
}

// -----------------------------------------------------------------------------
// FAST CHUNK GENERATORS (For Real User Scale N >= 200: 500, 1000, 10000, 50000, 100000)
// High-performance batched inner loops with zero GC overhead and 60fps rendering
// -----------------------------------------------------------------------------

function* bubbleSortFastGen(arr) {
    const n = arr.length;
    let comp = 0, swap = 0;
    const yieldInterval = Math.max(1, Math.floor(n / 60));

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - 1 - i; j++) {
            comp++;
            if (arr[j] > arr[j + 1]) {
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swap++;
                swapped = true;
            }
        }
        if (i % yieldInterval === 0 || i === n - 2 || !swapped) {
            yield {
                type: 'chunk',
                compDelta: comp,
                swapDelta: swap,
                prog: ((i + 1) / (n - 1)) * 100,
                sortedIdx: n - 1 - i
            };
            comp = 0;
            swap = 0;
        }
        if (!swapped) break;
    }
    yield { type: 'done', prog: 100, compDelta: comp, swapDelta: swap };
}

function* selectionSortFastGen(arr) {
    const n = arr.length;
    let comp = 0, swap = 0;
    const yieldInterval = Math.max(1, Math.floor(n / 60));

    for (let i = 0; i < n - 1; i++) {
        let min = i;
        for (let j = i + 1; j < n; j++) {
            comp++;
            if (arr[j] < arr[min]) {
                min = j;
            }
        }
        if (min !== i) {
            const temp = arr[i];
            arr[i] = arr[min];
            arr[min] = temp;
            swap++;
        }
        if (i % yieldInterval === 0 || i === n - 2) {
            yield {
                type: 'chunk',
                compDelta: comp,
                swapDelta: swap,
                prog: ((i + 1) / (n - 1)) * 100,
                sortedIdx: i
            };
            comp = 0;
            swap = 0;
        }
    }
    yield { type: 'done', prog: 100, compDelta: comp, swapDelta: swap };
}

function* insertionSortFastGen(arr) {
    const n = arr.length;
    let comp = 0, swap = 0;
    const yieldInterval = Math.max(1, Math.floor(n / 60));

    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        while (j >= 0) {
            comp++;
            if (arr[j] > key) {
                arr[j + 1] = arr[j];
                swap++;
                j--;
            } else {
                break;
            }
        }
        arr[j + 1] = key;
        if (i % yieldInterval === 0 || i === n - 1) {
            yield {
                type: 'chunk',
                compDelta: comp,
                swapDelta: swap,
                prog: (i / (n - 1)) * 100,
                sortedIdx: i
            };
            comp = 0;
            swap = 0;
        }
    }
    yield { type: 'done', prog: 100, compDelta: comp, swapDelta: swap };
}

function* quickSortFastGen(arr) {
    const n = arr.length;
    let comp = 0, swap = 0;
    let sortedCount = 0;
    const yieldInterval = Math.max(1, Math.floor(n / 60));
    let lastYield = 0;

    function* qSort(l, r) {
        if (l < r) {
            const pivotVal = arr[l];
            let i = l;
            let j = r + 1;
            while (true) {
                do {
                    i++;
                    comp++;
                } while (i <= r && arr[i] < pivotVal);

                do {
                    j--;
                    comp++;
                } while (j >= l && arr[j] > pivotVal);

                if (i >= j) break;
                const temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                swap++;
            }
            const temp = arr[l];
            arr[l] = arr[j];
            arr[j] = temp;
            swap++;
            sortedCount++;

            if (sortedCount - lastYield >= yieldInterval) {
                lastYield = sortedCount;
                yield {
                    type: 'chunk',
                    compDelta: comp,
                    swapDelta: swap,
                    prog: (sortedCount / n) * 100,
                    sortedIdx: j
                };
                comp = 0;
                swap = 0;
            }

            yield* qSort(l, j - 1);
            yield* qSort(j + 1, r);
        } else if (l === r) {
            sortedCount++;
        }
    }

    yield* qSort(0, n - 1);
    yield { type: 'done', prog: 100, compDelta: comp, swapDelta: swap };
}

// =============================================================================
// ANIMATION CANVAS RENDERING & LOOP
// =============================================================================

function initAnimationCanvases() {
    adjustCanvasSizes();
    window.addEventListener('resize', () => {
        adjustCanvasSizes();
        renderAllCanvases();
    });
}

function adjustCanvasSizes() {
    const canvases = [
        document.getElementById('canvas-bubble'),
        document.getElementById('canvas-selection'),
        document.getElementById('canvas-insertion'),
        document.getElementById('canvas-quick'),
        document.getElementById('canvas-single')
    ];

    canvases.forEach(canvas => {
        if (!canvas || !canvas.parentElement) return;
        const rect = canvas.parentElement.getBoundingClientRect();
        const w = rect.width || canvas.parentElement.clientWidth || 400;
        const h = rect.height || canvas.parentElement.clientHeight || 230;
        canvas.width = Math.floor(w * (window.devicePixelRatio || 1));
        canvas.height = Math.floor(h * (window.devicePixelRatio || 1));
    });
}

function resetAnimationData() {
    stopAnimation();

    masterArray = generateActiveAnimationArray();

    ['bubble', 'selection', 'insertion', 'quick'].forEach(key => {
        algosState[key].arr = [...masterArray];
        algosState[key].done = false;
        algosState[key].comp = 0;
        algosState[key].swap = 0;
        algosState[key].progress = 0;
        algosState[key].elapsed = 0;
        algosState[key].highlights = {
            compare: [],
            pivot: null,
            swap: [],
            sorted: new Set()
        };

        if (arraySize <= 120) {
            if (key === 'bubble') algosState[key].gen = bubbleSortGen(algosState[key].arr);
            if (key === 'selection') algosState[key].gen = selectionSortGen(algosState[key].arr);
            if (key === 'insertion') algosState[key].gen = insertionSortGen(algosState[key].arr);
            if (key === 'quick') algosState[key].gen = quickSortGen(algosState[key].arr);
        } else {
            if (key === 'bubble') algosState[key].gen = bubbleSortFastGen(algosState[key].arr);
            if (key === 'selection') algosState[key].gen = selectionSortFastGen(algosState[key].arr);
            if (key === 'insertion') algosState[key].gen = insertionSortFastGen(algosState[key].arr);
            if (key === 'quick') algosState[key].gen = quickSortFastGen(algosState[key].arr);
        }

        updateStatDisplay(key);
    });

    updateSingleViewDisplay();
    adjustCanvasSizes();
    renderAllCanvases();
    if (typeof updateAnimationSizeBadge === 'function') {
        updateAnimationSizeBadge();
    }
}

function drawBars(canvas, array, highlights = {}) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const n = array.length;
    let maxVal = 1;
    for (let i = 0; i < n; i++) {
        if (array[i] > maxVal) maxVal = array[i];
    }

    // If large array (N > 500), downsample to 400 bins for smooth 60fps rendering
    if (n > 500) {
        const displayBins = 400;
        const barWidth = width / displayBins;
        const step = n / displayBins;

        for (let b = 0; b < displayBins; b++) {
            const idx = Math.min(n - 1, Math.floor(b * step));
            const val = array[idx];
            const barHeight = (val / maxVal) * (height - 15);
            const x = b * barWidth;
            const y = height - barHeight;

            if (highlights.sorted && highlights.sorted.has(idx)) {
                ctx.fillStyle = '#10b981';
            } else if (highlights.compare && highlights.compare.includes(idx)) {
                ctx.fillStyle = '#ef4444';
            } else if (highlights.pivot === idx) {
                ctx.fillStyle = '#f59e0b';
            } else {
                ctx.fillStyle = '#cbd5e1';
            }
            ctx.fillRect(x, y, Math.max(1, barWidth - 0.5), barHeight);
        }
    } else {
        const barWidth = width / n;
        for (let i = 0; i < n; i++) {
            const barHeight = (array[i] / maxVal) * (height - 15);
            const x = i * barWidth;
            const y = height - barHeight;

            if (highlights.sorted && highlights.sorted.has(i)) {
                ctx.fillStyle = '#10b981';
            } else if (highlights.compare && highlights.compare.includes(i)) {
                ctx.fillStyle = '#ef4444';
            } else if (highlights.pivot === i) {
                ctx.fillStyle = '#f59e0b';
            } else if (highlights.swap && highlights.swap.includes(i)) {
                ctx.fillStyle = '#ec4899';
            } else {
                ctx.fillStyle = '#e2e8f0';
            }
            ctx.fillRect(x + 1, y, Math.max(1, barWidth - 1), barHeight);
        }
    }
}

function renderAllCanvases() {
    if (animMode === 'grid') {
        drawBars(document.getElementById('canvas-bubble'), algosState.bubble.arr, algosState.bubble.highlights);
        drawBars(document.getElementById('canvas-selection'), algosState.selection.arr, algosState.selection.highlights);
        drawBars(document.getElementById('canvas-insertion'), algosState.insertion.arr, algosState.insertion.highlights);
        drawBars(document.getElementById('canvas-quick'), algosState.quick.arr, algosState.quick.highlights);
    } else {
        const state = algosState[activeSingleAlgo];
        drawBars(document.getElementById('canvas-single'), state.arr, state.highlights);
    }
}

function updateStatDisplay(key) {
    const state = algosState[key];
    const compEl = document.getElementById(`${key}-comp`);
    const swapEl = document.getElementById(`${key}-swap`);
    const statusEl = document.getElementById(`${key}-status`);
    const timeEl = document.getElementById(`${key}-time`);
    const progEl = document.getElementById(`${key}-progress`);

    if (compEl) compEl.textContent = state.comp.toLocaleString();
    if (swapEl) swapEl.textContent = state.swap.toLocaleString();
    if (timeEl) timeEl.textContent = `${state.elapsed.toFixed(1)} ms`;
    if (progEl) progEl.style.width = `${Math.min(100, Math.max(0, state.progress))}%`;

    if (statusEl) {
        if (state.done) {
            statusEl.textContent = 'เสร็จสิ้น (Done!)';
            statusEl.className = 'stat-status completed';
        } else if (animRunning && !animPaused) {
            statusEl.textContent = `กำลังเรียง... ${Math.floor(state.progress)}%`;
            statusEl.className = 'stat-status running';
        } else {
            statusEl.textContent = 'พร้อมเริ่ม';
            statusEl.className = 'stat-status';
        }
    }

    if (animMode === 'single' && key === activeSingleAlgo) {
        updateSingleViewDisplay();
    }
}

function updateSingleViewDisplay() {
    const state = algosState[activeSingleAlgo];
    const cfg = ALGO_CONFIG[activeSingleAlgo];

    document.getElementById('single-title').textContent = cfg.name;
    document.getElementById('single-complexity').textContent = cfg.complexity;
    document.getElementById('single-dot').className = `color-dot dot-${activeSingleAlgo}`;
    document.getElementById('single-comp').textContent = state.comp.toLocaleString();
    document.getElementById('single-swap').textContent = state.swap.toLocaleString();
    document.getElementById('single-time').textContent = `${state.elapsed.toFixed(1)} ms`;

    const progEl = document.getElementById('single-progress');
    if (progEl) progEl.style.width = `${Math.min(100, Math.max(0, state.progress))}%`;

    const statusEl = document.getElementById('single-status');
    if (state.done) {
        statusEl.textContent = 'เสร็จสิ้น (Done!)';
        statusEl.className = 'stat-status completed';
    } else if (animRunning && !animPaused) {
        statusEl.textContent = `กำลังเรียง... ${Math.floor(state.progress)}%`;
        statusEl.className = 'stat-status running';
    } else {
        statusEl.textContent = 'พร้อมเริ่ม';
        statusEl.className = 'stat-status';
    }
}

function stepAlgorithm(key) {
    const state = algosState[key];
    if (state.done || !state.gen) return true;

    const res = state.gen.next();
    if (res.done || (res.value && res.value.type === 'done')) {
        state.done = true;
        state.progress = 100;
        if (res.value) {
            state.comp += (res.value.compDelta || 0);
            state.swap += (res.value.swapDelta || 0);
        }
        state.highlights.compare = [];
        state.highlights.swap = [];
        state.highlights.pivot = null;
        for (let i = 0; i < state.arr.length; i++) {
            state.highlights.sorted.add(i);
        }
        updateStatDisplay(key);
        return true;
    }

    const action = res.value;
    if (!action) return false;

    if (action.prog !== undefined) {
        state.progress = action.prog;
    }

    if (action.type === 'chunk') {
        state.comp += (action.compDelta || 0);
        state.swap += (action.swapDelta || 0);
        if (action.sortedIdx !== undefined) {
            state.highlights.sorted.add(action.sortedIdx);
        }
        if (action.pivot !== undefined) {
            state.highlights.pivot = action.pivot;
        }
    } else if (action.type === 'compare') {
        state.comp++;
        state.highlights.compare = action.indices;
        state.highlights.swap = [];
        playTone(action.val || state.arr[action.indices[0]], arraySize);
    } else if (action.type === 'swap') {
        state.swap++;
        state.highlights.swap = action.indices;
        state.highlights.compare = [];
        playTone(action.val || state.arr[action.indices[0]], arraySize);
    } else if (action.type === 'overwrite') {
        state.swap++;
        state.highlights.swap = [action.index];
        playTone(action.val || action.value, arraySize);
    } else if (action.type === 'pivot') {
        state.highlights.pivot = action.index;
    } else if (action.type === 'sorted') {
        state.highlights.sorted.add(action.index);
    }

    return false;
}

// Main Animation Loop with Adaptive Batching for Real Scale N
function animationLoop() {
    if (!animRunning || animPaused) return;

    // Calculate batch steps per frame based on arraySize & speed
    let stepsPerFrame = 1;
    if (arraySize <= 120) {
        stepsPerFrame = animSpeed > 70 ? Math.floor(1 + (animSpeed - 70) * 0.8) : 1;
    } else {
        stepsPerFrame = Math.max(1, Math.floor(animSpeed / 25));
    }

    const algosToRun = (animMode === 'grid') 
        ? ['bubble', 'selection', 'insertion', 'quick'] 
        : [activeSingleAlgo];

    let allCompleted = true;
    const now = performance.now();

    for (let step = 0; step < stepsPerFrame; step++) {
        let anyProgress = false;
        algosToRun.forEach(key => {
            const state = algosState[key];
            if (!state.done) {
                stepAlgorithm(key);
                state.elapsed = now - state.startTime;
                anyProgress = true;
                allCompleted = false;
            }
        });
        if (!anyProgress) break;
    }

    algosToRun.forEach(key => {
        updateStatDisplay(key);
    });

    renderAllCanvases();

    if (allCompleted) {
        stopAnimation();
        showToast('การจัดเรียงเสร็จสิ้นทั้งหมดแล้ว! 🏆');
        return;
    }

    let delay = 0;
    if (arraySize <= 100 && animSpeed < 70) {
        delay = Math.floor((70 - animSpeed) * 2.2);
    }

    if (delay > 0) {
        setTimeout(() => {
            if (animRunning && !animPaused) {
                animFrameId = requestAnimationFrame(animationLoop);
            }
        }, delay);
    } else {
        animFrameId = requestAnimationFrame(animationLoop);
    }
}

function startAnimation() {
    initAudio();

    let allDone = true;
    const algos = (animMode === 'grid') ? ['bubble', 'selection', 'insertion', 'quick'] : [activeSingleAlgo];
    algos.forEach(k => {
        if (!algosState[k].done) allDone = false;
    });

    if (allDone) {
        resetAnimationData();
    }

    const now = performance.now();
    algos.forEach(k => {
        if (!algosState[k].done && algosState[k].comp === 0) {
            algosState[k].startTime = now;
        }
    });

    animRunning = true;
    animPaused = false;
    document.getElementById('play-btn-icon').textContent = '⏸';
    document.getElementById('play-btn-text').textContent = 'หยุดชั่วคราว (Pause)';

    algos.forEach(k => updateStatDisplay(k));

    animationLoop();
}

function pauseAnimation() {
    animPaused = true;
    document.getElementById('play-btn-icon').textContent = '▶';
    document.getElementById('play-btn-text').textContent = 'เล่นต่อ (Resume)';
    if (animFrameId) cancelAnimationFrame(animFrameId);
}

function stopAnimation() {
    animRunning = false;
    animPaused = false;
    document.getElementById('play-btn-icon').textContent = '▶';
    document.getElementById('play-btn-text').textContent = 'เริ่มเล่น (Start)';
    if (animFrameId) cancelAnimationFrame(animFrameId);
}

function initAnimationEventListeners() {
    const playBtn = document.getElementById('anim-play-btn');
    playBtn.addEventListener('click', () => {
        if (!animRunning) {
            startAnimation();
        } else if (animPaused) {
            animPaused = false;
            document.getElementById('play-btn-icon').textContent = '⏸';
            document.getElementById('play-btn-text').textContent = 'หยุดชั่วคราว (Pause)';
            animationLoop();
        } else {
            pauseAnimation();
        }
    });

    document.getElementById('anim-reset-btn').addEventListener('click', () => {
        resetAnimationData();
        showToast('สุ่มชุดข้อมูลใหม่เรียบร้อย 🔄');
    });

    const modeBtns = document.querySelectorAll('.mode-btn[data-anim-mode]');
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            animMode = btn.dataset.animMode;

            const gridView = document.getElementById('anim-grid-view');
            const singleView = document.getElementById('anim-single-view');
            const singleGroup = document.getElementById('single-algo-group');

            if (animMode === 'grid') {
                gridView.style.display = 'grid';
                singleView.style.display = 'none';
                singleGroup.style.display = 'none';
            } else {
                gridView.style.display = 'none';
                singleView.style.display = 'block';
                singleGroup.style.display = 'flex';
                updateSingleViewDisplay();
            }

            adjustCanvasSizes();
            renderAllCanvases();
        });
    });

    const algoPills = document.querySelectorAll('.algo-pill');
    algoPills.forEach(pill => {
        pill.addEventListener('click', () => {
            algoPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeSingleAlgo = pill.dataset.algo;
            updateSingleViewDisplay();
            renderAllCanvases();
        });
    });

    const speedSlider = document.getElementById('speed-slider');
    const speedVal = document.getElementById('speed-val');
    speedSlider.addEventListener('input', (e) => {
        animSpeed = parseInt(e.target.value);
        if (animSpeed < 30) speedVal.textContent = 'ช้า';
        else if (animSpeed < 70) speedVal.textContent = 'ปานกลาง';
        else if (animSpeed < 90) speedVal.textContent = 'เร็ว';
        else speedVal.textContent = 'เร็วมาก (Turbo)';
    });

    const sizeSlider = document.getElementById('size-slider');
    const sizeVal = document.getElementById('size-val');
    sizeSlider.addEventListener('change', (e) => {
        if (animSource === 'sample') {
            arraySize = parseInt(e.target.value);
            sizeVal.textContent = arraySize;
            resetAnimationData();
        }
    });

    const audioBtn = document.getElementById('audio-toggle-btn');
    const audioStatus = document.getElementById('audio-status');
    audioBtn.addEventListener('click', () => {
        audioEnabled = !audioEnabled;
        if (audioEnabled) {
            audioStatus.textContent = 'เปิด';
            audioStatus.className = 'audio-on';
            initAudio();
        } else {
            audioStatus.textContent = 'ปิด';
            audioStatus.className = 'audio-off';
        }
    });
}

// =============================================================================
// BENCHMARK TABLE & CHART FUNCTIONS
// =============================================================================

function initBenchmarkSourceSwitching() {
    const tabUser = document.getElementById('tab-source-user');
    const tabSample = document.getElementById('tab-source-sample');
    const sampleBanner = document.getElementById('sample-notice-banner');
    const userControls = document.getElementById('user-controls-section');
    const tableTitle = document.getElementById('table-display-title');
    const graphTitle = document.getElementById('graph-main-title');
    const btnCopySample = document.getElementById('btn-copy-sample-to-user');

    tabUser.addEventListener('click', () => {
        if (currentDataSource === 'user') return;
        currentDataSource = 'user';
        tabUser.classList.add('active');
        tabSample.classList.remove('active');
        sampleBanner.style.display = 'none';
        userControls.style.display = 'block';
        tableTitle.textContent = 'ตารางข้อมูลจริง (User Data)';
        graphTitle.textContent = 'กราฟเปรียบเทียบประสิทธิภาพ (ข้อมูลจริง)';
        renderActiveBenchmarkTable();
        generateChart();
        showToast('สลับมายัง: ข้อมูลจริงของฉัน ✍️');
    });

    tabSample.addEventListener('click', () => {
        if (currentDataSource === 'sample') return;
        saveCurrentTableToUserData();
        currentDataSource = 'sample';
        tabSample.classList.add('active');
        tabUser.classList.remove('active');
        sampleBanner.style.display = 'flex';
        userControls.style.display = 'none';
        tableTitle.textContent = 'ตารางข้อมูลตัวอย่าง (Sample Demo)';
        graphTitle.textContent = 'กราฟเปรียบเทียบประสิทธิภาพ (ชุดข้อมูลตัวอย่าง)';
        renderActiveBenchmarkTable();
        generateChart();
        showToast('สลับมายัง: ชุดข้อมูลตัวอย่าง 💡');
    });

    btnCopySample.addEventListener('click', () => {
        userBenchmarkData = JSON.parse(JSON.stringify(SAMPLE_BENCHMARK_DATA));
        selectedNSizes = new Set([500, 1000, 10000, 50000, 100000]);
        updateBenchmarkNPillsUI();
        tabUser.click();
        showToast('คัดลอกข้อมูลตัวอย่างลงในข้อมูลจริงเรียบร้อยแล้ว! 📥');
    });
}

function initBenchmarkNSizePills() {
    const pills = document.querySelectorAll('#n-pills-container .n-pill');
    const btnSelectAll = document.getElementById('btn-select-all-n');
    const btnClearAll = document.getElementById('btn-clear-all-n');

    pills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            const nVal = parseInt(pill.dataset.n);
            // Toggle visibility for the clicked N size (no Ctrl needed)
            if (selectedNSizes.has(nVal)) {
                selectedNSizes.delete(nVal);
                showToast(`ซ่อนข้อมูลขนาด N = ${nVal.toLocaleString()} 👁️‍🗨️`);
            } else {
                selectedNSizes.add(nVal);
                showToast(`แสดงข้อมูลขนาด N = ${nVal.toLocaleString()} 🎯`);
            }

            updateBenchmarkNPillsUI();
            renderActiveBenchmarkTable();
            generateChart();
        });
    });

    if (btnSelectAll) {
        btnSelectAll.addEventListener('click', () => {
            selectedNSizes = new Set([500, 1000, 10000, 50000, 100000]);
            updateBenchmarkNPillsUI();
            renderActiveBenchmarkTable();
            generateChart();
            showToast('เลือกแสดงข้อมูลขนาดทั้งหมด (500 - 100,000)');
        });
    }

    if (btnClearAll) {
        btnClearAll.addEventListener('click', () => {
            selectedNSizes.clear();
            updateBenchmarkNPillsUI();
            renderActiveBenchmarkTable();
            generateChart();
            showToast('ล้างการเลือกขนาด N แล้ว (กดเลือก N ที่ต้องการดู)');
        });
    }
}

function updateBenchmarkNPillsUI() {
    const pills = document.querySelectorAll('#n-pills-container .n-pill');
    pills.forEach(p => {
        const val = parseInt(p.dataset.n);
        if (selectedNSizes.has(val)) p.classList.add('active');
        else p.classList.remove('active');
    });
}

function renderActiveBenchmarkTable() {
    const sourceData = (currentDataSource === 'sample') ? SAMPLE_BENCHMARK_DATA : userBenchmarkData;
    const isSample = (currentDataSource === 'sample');

    let filteredData = sourceData;
    if (!isSample) {
        filteredData = sourceData.filter(d => selectedNSizes.has(d.n));
    }

    const tbody = document.getElementById('table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (filteredData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 22px 10px; color: var(--text-muted); font-size: 0.84rem;">
            🔍 ยังไม่ได้เลือกขนาดข้อมูล — กรุณากดเลือกปุ่ม N ด้านบน หรือกด "เลือกทั้งหมด"
        </td></tr>`;
        return;
    }

    filteredData.forEach(row => {
        addBenchmarkRowToTable(row.n, row.bubble, row.selection, row.insertion, row.quick, isSample);
    });
}

function addBenchmarkRowToTable(n = '', bubble = '', selection = '', insertion = '', quick = '', isReadOnly = false) {
    const tbody = document.getElementById('table-body');
    const tr = document.createElement('tr');
    const ro = isReadOnly ? 'readonly style="opacity: 0.85; cursor: not-allowed;"' : '';

    tr.innerHTML = `
        <td>
            <input type="number" class="input-n" value="${n}" placeholder="500" required min="1" step="1" ${ro}>
        </td>
        <td>
            <input type="number" class="input-bubble" value="${bubble}" placeholder="0.0" required min="0" step="any" ${ro}>
        </td>
        <td>
            <input type="number" class="input-selection" value="${selection}" placeholder="0.0" required min="0" step="any" ${ro}>
        </td>
        <td>
            <input type="number" class="input-insertion" value="${insertion}" placeholder="0.0" required min="0" step="any" ${ro}>
        </td>
        <td>
            <input type="number" class="input-quick" value="${quick}" placeholder="0.0" required min="0" step="any" ${ro}>
        </td>
        <td style="text-align: center;">
            ${isReadOnly ? '' : '<button type="button" class="btn-delete-row" title="ลบแถวนี้">✕</button>'}
        </td>
    `;

    if (!isReadOnly) {
        tr.querySelector('.btn-delete-row').addEventListener('click', () => {
            const rows = tbody.querySelectorAll('tr');
            if (rows.length <= 1) {
                showToast('ต้องมีอย่างน้อย 1 แถว');
                return;
            }
            tr.remove();
            saveCurrentTableToUserData();
            generateChart();
        });
    }

    tbody.appendChild(tr);
}

function saveCurrentTableToUserData() {
    if (currentDataSource === 'sample') return;
    const currentTableData = getFormData();
    if (currentTableData.length > 0) {
        currentTableData.forEach(item => {
            const idx = userBenchmarkData.findIndex(u => u.n === item.n);
            if (idx >= 0) {
                userBenchmarkData[idx] = item;
            } else {
                userBenchmarkData.push(item);
            }
        });
        userBenchmarkData.sort((a, b) => a.n - b.n);
    }
}

function getFormData() {
    const tbody = document.getElementById('table-body');
    const rows = tbody.querySelectorAll('tr');
    const data = [];

    rows.forEach(row => {
        const n = parseFloat(row.querySelector('.input-n').value);
        const bubble = parseFloat(row.querySelector('.input-bubble').value);
        const selection = parseFloat(row.querySelector('.input-selection').value);
        const insertion = parseFloat(row.querySelector('.input-insertion').value);
        const quick = parseFloat(row.querySelector('.input-quick').value);

        if (!isNaN(n) && !isNaN(bubble) && !isNaN(selection) && !isNaN(insertion) && !isNaN(quick)) {
            data.push({ n, bubble, selection, insertion, quick });
        }
    });

    data.sort((a, b) => a.n - b.n);
    return data;
}

function initQuickPasteHandler() {
    const pasteBox = document.getElementById('quick-paste-box');

    pasteBox.addEventListener('paste', (e) => {
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        handlePastedTerminalData(pastedText);
        e.preventDefault();
    });

    pasteBox.addEventListener('input', () => {
        if (pasteBox.value.trim().length > 0) {
            handlePastedTerminalData(pasteBox.value);
            pasteBox.value = '';
        }
    });

    window.addEventListener('paste', (e) => {
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        if (pastedText && pastedText.includes('|') && /\d/.test(pastedText)) {
            handlePastedTerminalData(pastedText);
            e.preventDefault();
        }
    });
}

function handlePastedTerminalData(rawText) {
    if (!rawText || !rawText.trim()) return;

    // Parse SYSTEM_INFO if present
    if (rawText.includes('[SYSTEM_INFO]')) {
        const cpuMatch = rawText.match(/CPU:\s*(.+)/i);
        const ramMatch = rawText.match(/RAM:\s*(.+)/i);
        const diskMatch = rawText.match(/DISK:\s*(.+)/i);
        window.parsedSystemSpecs = {
            cpu: cpuMatch ? cpuMatch[1].trim() : null,
            ram: ramMatch ? ramMatch[1].trim() : null,
            disk: diskMatch ? diskMatch[1].trim() : null
        };
    } else {
        window.parsedSystemSpecs = null;
    }

    const parsed = parseTerminalTable(rawText);
    if (parsed.length > 0) {
        if (currentDataSource === 'sample') {
            document.getElementById('tab-source-user').click();
        }

        userBenchmarkData = parsed;
        selectedNSizes = new Set(parsed.map(d => d.n));
        updateBenchmarkNPillsUI();
        renderActiveBenchmarkTable();
        generateChart();
        showToast(`วางข้อมูลจริงสำเร็จ ${parsed.length} ขนาด N และสร้างกราฟให้ทันที 🎉`);

        if (window.innerWidth < 1140) {
            document.getElementById('graph-section').scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        showToast('⚠️ ไม่พบข้อมูลที่ตรงกับตาราง กรุณาลองคัดลอกตารางจาก Terminal อีกครั้ง');
    }
}

function parseTerminalTable(text) {
    const lines = text.split('\n');
    const result = [];

    for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith('=') || line.startsWith('-') || line.startsWith('+')) continue;

        const lower = line.toLowerCase();
        if (lower.includes('data') || lower.includes('sort') || lower.includes('bubble') || lower.includes('(ms)')) continue;

        if (line.includes('|')) {
            const parts = line.split('|').map(p => p.trim().replace(/,/g, '')).filter(p => p.length > 0);
            if (parts.length >= 5) {
                const n = parseFloat(parts[0]);
                const bubble = parseFloat(parts[1]);
                const selection = parseFloat(parts[2]);
                const insertion = parseFloat(parts[3]);
                const quick = parseFloat(parts[4]);

                if (!isNaN(n) && !isNaN(bubble) && !isNaN(selection) && !isNaN(insertion) && !isNaN(quick)) {
                    result.push({ n, bubble, selection, insertion, quick });
                }
            }
        } else {
            const parts = line.trim().split(/\s+/).map(p => p.replace(/,/g, ''));
            if (parts.length >= 5) {
                const n = parseFloat(parts[0]);
                const bubble = parseFloat(parts[1]);
                const selection = parseFloat(parts[2]);
                const insertion = parseFloat(parts[3]);
                const quick = parseFloat(parts[4]);

                if (!isNaN(n) && !isNaN(bubble) && !isNaN(selection) && !isNaN(insertion) && !isNaN(quick)) {
                    result.push({ n, bubble, selection, insertion, quick });
                }
            }
        }
    }

    return result;
}

function initBenchmarkEventListeners() {
    const form = document.getElementById('benchmark-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveCurrentTableToUserData();
        generateChart();
        saveCurrentToHistory();
        showToast('อัปเดตกราฟและบันทึกประวัติเรียบร้อยแล้ว ✨');

        if (currentDataSource === 'user') {
            promptRankCollection();
        }

        if (window.innerWidth < 1140) {
            document.getElementById('graph-section').scrollIntoView({ behavior: 'smooth' });
        }
    });

    const btnAddRow = document.getElementById('btn-add-row');
    if (btnAddRow) {
        btnAddRow.addEventListener('click', () => {
            if (currentDataSource === 'sample') {
                showToast('กรุณาสลับไปยังโหมด "ข้อมูลจริงของฉัน" ก่อนเพิ่มแถว');
                return;
            }
            addBenchmarkRowToTable();
        });
    }

    const btnClear = document.getElementById('btn-clear');
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            if (currentDataSource === 'sample') {
                showToast('ไม่สามารถล้างข้อมูลตัวอย่างได้');
                return;
            }
            const tbody = document.getElementById('table-body');
            if (tbody) {
                tbody.innerHTML = '';
                addBenchmarkRowToTable();
            }
            showToast('ล้างข้อมูลเรียบร้อย');
        });
    }

    const btnPrefill = document.getElementById('btn-copy-sample-to-user') || document.getElementById('btn-prefill');
    if (btnPrefill) {
        btnPrefill.addEventListener('click', () => {
            userBenchmarkData = JSON.parse(JSON.stringify(SAMPLE_BENCHMARK_DATA));
            selectedNSizes = new Set([500, 1000, 10000, 50000, 100000]);
            updateBenchmarkNPillsUI();
            if (currentDataSource === 'sample') {
                document.getElementById('tab-source-user').click();
            } else {
                renderActiveBenchmarkTable();
                generateChart();
            }
            showToast('คัดลอกข้อมูลตัวอย่างลงในข้อมูลจริงแล้ว ⚡');
        });
    }

    const scaleButtons = document.querySelectorAll('#scale-toggle-group .btn-toggle');
    scaleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            scaleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentScaleType = btn.dataset.scale;
            updateChartScale();
        });
    });

    const filterTabs = document.querySelectorAll('#filter-tabs .tab-btn');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            applyAlgorithmFilter();
        });
    });

    document.getElementById('btn-download').addEventListener('click', () => {
        if (!chartInstance) return;
        const link = document.createElement('a');
        link.download = `sorting-benchmark-${currentDataSource}-${currentFilter}-${currentScaleType}.png`;
        link.href = chartInstance.toBase64Image('image/png', 1.0);
        link.click();
        showToast('กำลังดาวน์โหลดรูปภาพกราฟ... 📥');
    });
}

function generateChart() {
    const data = getFormData();
    if (data.length === 0) return;

    const labels = data.map(d => d.n.toLocaleString());

    const datasets = [
        {
            label: ALGO_CONFIG.bubble.name,
            algoKey: 'bubble',
            data: data.map(d => d.bubble),
            borderColor: ALGO_CONFIG.bubble.color,
            backgroundColor: ALGO_CONFIG.bubble.bgColor,
            pointBackgroundColor: ALGO_CONFIG.bubble.color,
            pointBorderColor: ALGO_CONFIG.bubble.pointBorderColor,
            pointHoverBackgroundColor: '#ffffff',
            pointHoverBorderColor: ALGO_CONFIG.bubble.color,
            pointRadius: 6,
            pointHoverRadius: 9,
            pointBorderWidth: 2,
            borderWidth: 3,
            tension: 0.25,
            fill: false
        },
        {
            label: ALGO_CONFIG.selection.name,
            algoKey: 'selection',
            data: data.map(d => d.selection),
            borderColor: ALGO_CONFIG.selection.color,
            backgroundColor: ALGO_CONFIG.selection.bgColor,
            pointBackgroundColor: ALGO_CONFIG.selection.color,
            pointBorderColor: ALGO_CONFIG.selection.pointBorderColor,
            pointHoverBackgroundColor: '#ffffff',
            pointHoverBorderColor: ALGO_CONFIG.selection.color,
            pointRadius: 6,
            pointHoverRadius: 9,
            pointBorderWidth: 2,
            borderWidth: 3,
            tension: 0.25,
            fill: false
        },
        {
            label: ALGO_CONFIG.insertion.name,
            algoKey: 'insertion',
            data: data.map(d => d.insertion),
            borderColor: ALGO_CONFIG.insertion.color,
            backgroundColor: ALGO_CONFIG.insertion.bgColor,
            pointBackgroundColor: ALGO_CONFIG.insertion.color,
            pointBorderColor: ALGO_CONFIG.insertion.pointBorderColor,
            pointHoverBackgroundColor: '#ffffff',
            pointHoverBorderColor: ALGO_CONFIG.insertion.color,
            pointRadius: 6,
            pointHoverRadius: 9,
            pointBorderWidth: 2,
            borderWidth: 3,
            tension: 0.25,
            fill: false
        },
        {
            label: ALGO_CONFIG.quick.name,
            algoKey: 'quick',
            data: data.map(d => d.quick),
            borderColor: ALGO_CONFIG.quick.color,
            backgroundColor: ALGO_CONFIG.quick.bgColor,
            pointBackgroundColor: ALGO_CONFIG.quick.color,
            pointBorderColor: ALGO_CONFIG.quick.pointBorderColor,
            pointHoverBackgroundColor: '#ffffff',
            pointHoverBorderColor: ALGO_CONFIG.quick.color,
            pointRadius: 6,
            pointHoverRadius: 9,
            pointBorderWidth: 2,
            borderWidth: 3,
            tension: 0.25,
            fill: false
        }
    ];

    const ctx = document.getElementById('benchmarkChart').getContext('2d');

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#cbd5e1',
                        font: { family: 'Outfit, Inter, sans-serif', size: 13, weight: '600' },
                        padding: 16,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.92)',
                    titleColor: '#f8fafc',
                    titleFont: { family: 'Outfit, sans-serif', size: 14, weight: '700' },
                    bodyColor: '#e2e8f0',
                    bodyFont: { family: 'JetBrains Mono, monospace', size: 13 },
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    borderWidth: 1,
                    padding: 12,
                    boxPadding: 6,
                    usePointStyle: true,
                    callbacks: {
                        title: (items) => `ขนาดข้อมูล N = ${items[0].label}`,
                        label: (context) => ` ${context.dataset.label}: ${context.raw.toFixed(4)} ms`
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'ขนาดข้อมูล (N)',
                        color: '#94a3b8',
                        font: { family: 'Outfit, sans-serif', size: 13, weight: '600' },
                        padding: { top: 10 }
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono, monospace', size: 12 } }
                },
                y: getYAxisConfig(currentScaleType)
            }
        }
    });

    applyAlgorithmFilter();
    updateInsights(data);
}

function getYAxisConfig(scaleType) {
    if (scaleType === 'logarithmic') {
        return {
            type: 'logarithmic',
            title: {
                display: true,
                text: 'เวลาที่ใช้ไป (มิลลิวินาที ms) [Log Scale]',
                color: '#94a3b8',
                font: { family: 'Outfit, sans-serif', size: 13, weight: '600' }
            },
            grid: { color: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' },
            ticks: {
                color: '#94a3b8',
                font: { family: 'JetBrains Mono, monospace', size: 11 },
                callback: function(value) {
                    if ([0.01, 0.1, 1, 10, 100, 1000, 10000].includes(value)) return value + ' ms';
                    return null;
                }
            }
        };
    } else {
        return {
            type: 'linear',
            beginAtZero: true,
            title: {
                display: true,
                text: 'เวลาที่ใช้ไป (มิลลิวินาที ms)',
                color: '#94a3b8',
                font: { family: 'Outfit, sans-serif', size: 13, weight: '600' }
            },
            grid: { color: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' },
            ticks: {
                color: '#94a3b8',
                font: { family: 'JetBrains Mono, monospace', size: 11 },
                callback: (value) => value.toLocaleString() + ' ms'
            }
        };
    }
}

function updateChartScale() {
    if (!chartInstance) return;
    chartInstance.options.scales.y = getYAxisConfig(currentScaleType);
    chartInstance.update();
}

function applyAlgorithmFilter() {
    if (!chartInstance) return;
    chartInstance.data.datasets.forEach(dataset => {
        dataset.hidden = (currentFilter !== 'all' && dataset.algoKey !== currentFilter);
    });
    chartInstance.update();
}

function updateInsights(data) {
    if (data.length === 0) return;
    const lastData = data[data.length - 1];
    const times = [
        { name: 'Bubble Sort', time: lastData.bubble },
        { name: 'Selection Sort', time: lastData.selection },
        { name: 'Insertion Sort', time: lastData.insertion },
        { name: 'Quick Sort', time: lastData.quick }
    ];
    times.sort((a, b) => a.time - b.time);

    const fastest = times[0];
    const slowest = times[times.length - 1];
    const ratio = (slowest.time / fastest.time).toFixed(1);

    document.getElementById('insight-fastest').textContent = fastest.name;
    document.getElementById('insight-fastest-time').textContent = `${fastest.time.toFixed(4)} ms (N = ${lastData.n.toLocaleString()})`;

    document.getElementById('insight-slowest').textContent = slowest.name;
    document.getElementById('insight-slowest-time').textContent = `${slowest.time.toFixed(4)} ms (N = ${lastData.n.toLocaleString()})`;

    document.getElementById('insight-ratio').textContent = `${parseFloat(ratio).toLocaleString()}x`;
}

function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 2800);
}

// =============================================================================
// LOCAL STORAGE HISTORY (LOG)
// =============================================================================

function initHistoryListeners() {
    const navBtnHistory = document.getElementById('nav-btn-history');
    const btnClear = document.getElementById('btn-clear-history');

    if (navBtnHistory) {
        navBtnHistory.addEventListener('click', () => {
            renderHistoryList();
        });
    }

    if (btnClear) {
        btnClear.addEventListener('click', () => {
            if (confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างประวัติทั้งหมด?')) {
                localStorage.removeItem('benchmarkHistory');
                renderHistoryList();
                showToast('ล้างประวัติทั้งหมดแล้ว 🗑️');
            }
        });
    }
}

function saveCurrentToHistory() {
    if (currentDataSource === 'sample') return; // Don't save sample data
    const data = getFormData();
    if (data.length === 0) return;

    let history = [];
    try {
        const stored = localStorage.getItem('benchmarkHistory');
        if (stored) history = JSON.parse(stored);
    } catch (e) {}

    const entry = {
        id: Date.now(),
        timestamp: new Date().toLocaleString('th-TH'),
        data: data
    };

    history.unshift(entry);
    
    // Keep max 50 entries
    if (history.length > 50) {
        history = history.slice(0, 50);
    }

    localStorage.setItem('benchmarkHistory', JSON.stringify(history));
}

function renderHistoryList() {
    const listEl = document.getElementById('history-list');
    if (!listEl) return;

    let history = [];
    try {
        const stored = localStorage.getItem('benchmarkHistory');
        if (stored) history = JSON.parse(stored);
    } catch (e) {}

    if (history.length === 0) {
        listEl.innerHTML = '<div class="history-empty">ยังไม่มีประวัติการบันทึกข้อมูล<br><br><small>เมื่อคุณกรอกข้อมูลจริงและกดปุ่ม "🚀 สร้างกราฟ (Submit)"<br>ระบบจะบันทึกประวัติให้โดยอัตโนมัติที่นี่</small></div>';
        return;
    }

    listEl.innerHTML = '';
    history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        
        const dataCount = item.data.length;
        const nSummary = item.data.map(d => d.n.toLocaleString()).slice(0, 3).join(', ');
        const nSuffix = dataCount > 3 ? '...' : '';

        div.innerHTML = `
            <div class="history-item-header">
                <span class="history-time">${item.timestamp}</span>
                <span class="history-badge">${dataCount} records</span>
            </div>
            <div class="history-preview">N = ${nSummary}${nSuffix}</div>
        `;

        div.addEventListener('click', () => {
            loadHistoryEntry(item.data);
            const benchNav = document.getElementById('nav-btn-bench');
            if (benchNav) benchNav.click();
        });

        listEl.appendChild(div);
    });
}

function loadHistoryEntry(data) {
    if (currentDataSource === 'sample') {
        document.getElementById('tab-source-user').click();
    }
    userBenchmarkData = JSON.parse(JSON.stringify(data));
    selectedNSizes = new Set(data.map(d => d.n));
    updateBenchmarkNPillsUI();
    renderActiveBenchmarkTable();
    generateChart();
    showToast('โหลดข้อมูลจากประวัติสำเร็จ 📂');
}

// =============================================================================
// RANK RECORD COLLECTION (AUTO)
// =============================================================================

function promptRankCollection() {
    const data = getFormData();
    let maxRecord = null;
    let maxN = 0;
    
    // Find the record with highest N to use as score
    data.forEach(d => {
        if (d.n > maxN) {
            maxN = d.n;
            maxRecord = d;
        }
    });

    // If we have Quick sort time, auto save it as rank and show toast
    if (maxRecord && maxRecord.quick > 0) {
        if (typeof saveUserRankAuto === 'function') {
            saveUserRankAuto(maxRecord.quick);
            showToast('อัปเดตแรงค์ (Rank) ปัจจุบันของคุณเรียบร้อย 🏆');
        }
    }
}


