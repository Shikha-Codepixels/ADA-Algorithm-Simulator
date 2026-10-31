
#include <iostream>
#include <vector>
#include "algorithms/knapsack.h"

using namespace std;

int main() {

    int n, capacity;

    if (!(cin >> n) || n < 0) {
        cout << "[]";
        return 0;
    }

    vector<int> weights(n);
    vector<int> values(n);

    for (int i = 0; i < n; i++) {
        if (!(cin >> weights[i])) {
            cout << "[]";
            return 0;
        }
    }

    for (int i = 0; i < n; i++) {
        if (!(cin >> values[i])) {
            cout << "[]";
            return 0;
        }
    }

    if (!(cin >> capacity) || capacity < 0) {
        cout << "[]";
        return 0;
    }

    runKnapsack(weights, values, capacity);

    printKnapsackStepsJSON();

    return 0;
}
