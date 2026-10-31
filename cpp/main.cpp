#include <iostream>
using namespace std;

void sortingMenu();
void quickSortMenu();
void huffmanMenu();
void knapsackMenu();
void dijkstraMenu();
void bellmanFordMenu();
void showMenu() {
    cout << "\n====== ADA Algorithm Simulator ======\n";
    cout << "1. Merge Sort Algorithm (Divide and Conquer)\n";
    cout << "2. Quick Sort Algorithm (Divide and Conquer)\n";
    cout << "3. Huffman Coding Algorithm (Greedy approach)\n";
    cout << "4. 0/1 Knapsack Algorithm (Dynamic programming)\n";
    cout << "5. Dijkstra Algorithm (Graphs)\n";
    cout << "6. Bellman Ford Algorithm (Graphs with negative weights)\n";
    cout << "0. Exit\n";
    cout << "Enter your choice: ";
}

int main() {
    int choice;

    do {
        showMenu();
        cin >> choice;

        switch (choice) {
            case 1:
                cout << "Merge Sort Algorithm selected\n";
                sortingMenu();
                break;
            case 2:
                cout << "Quick Sort Algorithm selected\n";
                quickSortMenu();
                break;
            case 3:
                cout << "Huffman Coding selected\n";
                huffmanMenu();
                break;
            case 4:
                cout << "0/1 knapsack Algorithm selected\n";
                knapsackMenu();
                break;
            case 5:
                cout << "Dijkstra Algorithm selected\n";
                dijkstraMenu();
                break;
            case 6:
                cout << "Bellman Ford Algorithm selected\n";
                bellmanFordMenu();
                break;
            case 0:
                cout << "Exiting...\n";
                break;
            default:
                cout << "Invalid choice, try again \n";
        }

    } while (choice != 0);

    return 0;
}

