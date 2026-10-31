
#include <iostream>
#include <vector>
#include "algorithms/sorting.h"

using namespace std;

int main() {
    int n;

    if (!(cin >> n) || n <= 0) {
        cout << "[]";
        return 0;
    }

    vector<int> arr(n);

    for (int i = 0; i < n; i++) {
        if (!(cin >> arr[i])) {
            cout << "[]";
            return 0;
        }
    }

    runMergeSort(arr);
    printStepsJSON();

    return 0;
}
