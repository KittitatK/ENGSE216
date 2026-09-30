const MACHINE_RANKS = [
    {
        name: "ASUS's PC",
        cpu: "AMD Ryzen 7 7435HS",
        ram: "32 GB",
        score: 5.2168
    },
    
    {
        name: "ROG Zephyrus G14",
        cpu: "AMD Ryzen 9 7940HS",
        ram: "32GB DDR5",
        score: 4.85 // ms for Quick Sort 100k
    },
    {
        name: "MacBook Pro M2 Max",
        cpu: "Apple M2 Max",
        ram: "64GB Unified",
        score: 5.12
    },
    {
        name: "Legion 5 Pro",
        cpu: "Intel Core i7-13700HX",
        ram: "16GB DDR5",
        score: 5.45
    }
];

function getCombinedRanks() {
    let localRanks = [];
    try {
        const stored = localStorage.getItem('localRanks');
        if (stored) localRanks = JSON.parse(stored);
    } catch (e) {}
    
    const combined = [...MACHINE_RANKS, ...localRanks];
    
    // Sort by score ascending (lower time is better)
    combined.sort((a, b) => a.score - b.score);
    
    // Assign rank numbers
    combined.forEach((machine, index) => {
        machine.rank = index + 1;
    });
    
    return combined;
}

function renderRankTable() {
    const tbody = document.getElementById('rank-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    const combinedRanks = getCombinedRanks();
    
    // Check user rank
    const userRankObj = combinedRanks.find(m => m.isUser);
    const userDisplay = document.getElementById('user-rank-display');
    const userRankNum = document.getElementById('user-rank-number');
    const userRankScore = document.getElementById('user-rank-score');
    
    if (userRankObj && userDisplay) {
        userDisplay.style.display = 'block';
        userRankNum.textContent = userRankObj.rank;
        userRankScore.textContent = userRankObj.score.toFixed(4);
    } else if (userDisplay) {
        userDisplay.style.display = 'none';
    }
    
    // Only TOP 20
    const top20 = combinedRanks.slice(0, 20);
    
    top20.forEach(machine => {
        const tr = document.createElement('tr');
        
        if (machine.isUser) {
            tr.style.backgroundColor = 'rgba(99, 102, 241, 0.15)'; // Highlight user row
            tr.style.borderLeft = '4px solid var(--color-accent)';
        }
        
        // Highlight rank 1, 2, 3 with colors or medals
        let rankDisplay = machine.rank;
        if (machine.rank === 1) rankDisplay = '🥇 1';
        else if (machine.rank === 2) rankDisplay = '🥈 2';
        else if (machine.rank === 3) rankDisplay = '🥉 3';

        tr.innerHTML = `
            <td style="font-weight: bold; color: var(--color-accent); padding: 12px;">${rankDisplay}</td>
            <td style="font-weight: 600; color: #f8fafc; padding: 12px;">${machine.name}</td>
            <td style="color: #cbd5e1; padding: 12px;">${machine.cpu}</td>
            <td style="color: #94a3b8; padding: 12px;">${machine.ram}</td>
            <td style="color: #10b981; font-weight: bold; padding: 12px;">${machine.score.toFixed(4)} ms</td>
        `;
        tbody.appendChild(tr);
    });
}

function saveUserRankAuto(score) {
    let userCores = navigator.hardwareConcurrency ? navigator.hardwareConcurrency + " Cores CPU" : "Unknown CPU";
    let userRam = navigator.deviceMemory ? navigator.deviceMemory + "GB+ RAM" : "Unknown RAM";
    let userName = "เครื่องของคุณ (You)";
    
    if (window.parsedSystemSpecs) {
        if (window.parsedSystemSpecs.cpu) userCores = window.parsedSystemSpecs.cpu;
        if (window.parsedSystemSpecs.ram) userRam = window.parsedSystemSpecs.ram;
        userName = "My PC (Pasted Specs)";
    }

    const record = {
        name: userName,
        cpu: userCores,
        ram: userRam,
        score: score,
        isUser: true
    };
    
    localStorage.setItem('localRanks', JSON.stringify([record]));
    renderRankTable();
}

// Render when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add Score header dynamically
    const theadTr = document.querySelector('.rank-table thead tr');
    if (theadTr && !theadTr.innerHTML.includes('Score')) {
        const th = document.createElement('th');
        th.style = "text-align: left; padding: 12px;";
        th.innerHTML = "Score<br><small style='color:#64748b;font-weight:normal;'>(Quick N=100k)</small>";
        theadTr.appendChild(th);
    }
    
    renderRankTable();
});
