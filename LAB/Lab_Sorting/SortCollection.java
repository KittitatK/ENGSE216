package LAB.Lab_Sorting;

public class SortCollection {//bubble insertion selection quick 
    //bubble sort
    public void bubbleSort(int[] arrdata){

        for ( int i = 0 ; i < arrdata.length -1 ; i++){
            for ( int j = 0 ; j < arrdata.length -1 -i ; j++){
                if (arrdata[ j ] > arrdata[ j + 1 ]){
                    int temp = arrdata[ j ];
                    arrdata[ j ] = arrdata[ j + 1 ];
                    arrdata[ j + 1 ] = temp;
                }
            }
        }
    }

    //insertion sort
    public void insertionSort(int[] arrdata){

        for ( int i = 1 ; i < arrdata.length ; i++){
            int k = arrdata[ i ];
            int j = i-1;

            while( j >= 0 && arrdata[ j ] > k){
                arrdata[ j + 1 ] = arrdata[ j ];
                j--;
                
            }
            arrdata[ j + 1 ] = k;
        }

    }

    //selection sort
    public void selectionSort(int[] arrdata){

        for ( int i = 0  ; i < arrdata.length - 1 ; i++){
            int min = i;

            for ( int j = i + 1 ; j < arrdata.length  ; j++){
                if ( arrdata[ j ] < arrdata[ min ] ){
                    min = j;
                }
            }

            int temp = arrdata[ i ];
            arrdata[ i ] = arrdata[ min ];
            arrdata[ min ] = temp;
        }
    }

    //quick sort
    public void quickSort(int[] arrdata) { //เรียกใช้
        if (arrdata != null && arrdata.length > 1) {
            quickSort(arrdata, 0, arrdata.length - 1);
        }
    }

    //-----------------------------------quick sort function---------------------------

    public static void quickSort(int[] arrdata, int l , int r){

        if ( l < r){

            int pivot = partition (arrdata, l , r);
            quickSort (arrdata, l , pivot -1);
            quickSort (arrdata, pivot + 1 , r);
        }

    }

    public static int partition( int[] arrdata, int l , int r){

        int pivot = arrdata[ l ];
        int i = l;
        int j = r + 1;

        do{ 

            do{ 
                i++ ;

            } while (i < r && arrdata[i] < pivot);

            do{
                j-- ;

            } while (arrdata[j] > pivot);

             //swap( A[i] , A[j] )
            int temp1 = arrdata[ i ];
            arrdata[ i ] = arrdata[ j ];
            arrdata[ j ] = temp1;

        }while (i < j);

        //swap( A[i] , A[j] )
        int temp2 = arrdata[ i ];
        arrdata[ i ] =  arrdata[ j ];
        arrdata[ j ] = temp2;

        //swap( A[l] , A[j] )
        int temp3 = arrdata[ l ];
        arrdata[ l ] = arrdata[ j ];
        arrdata[ j ] = temp3;

        return j;

    }



    


}
