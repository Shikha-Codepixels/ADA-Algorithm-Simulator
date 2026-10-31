
#include <iostream>
#include <vector>
#include <string>
#include "quicksort.h"

using namespace std;

vector<QuickSortStep> quickSortSteps;

// Capture a section of the array
vector<int> getPart(
    const vector<int>& arr,
    int start,
    int end
) {
    vector<int> part;

    for (int i = start; i <= end; i++) {
        part.push_back(arr[i]);
    }

    return part;
}

// Print a vector in JSON array format
void printVector(const vector<int>& arr) {
    cout << "[";

    for (size_t i = 0; i < arr.size(); i++) {
        cout << arr[i];

        if (i < arr.size() - 1) {
            cout << ",";
        }
    }

    cout << "]";
}

// partition logic with visualization logging
int partition(
    vector<int>& arr,
    int low,
    int high,
    const string& path
) {
    int pivot = arr[low];
    int i = low + 1;
    int j = high;

    while (i <= j) {

        while (i <= high && arr[i] <= pivot) {
            i++;
        }

        while (j >= low + 1 && arr[j] > pivot) {
            j--;
        }

        if (i < j) {
            swap(arr[i], arr[j]);
        }
    }

    // Place pivot in its correct position
    swap(arr[low], arr[j]);

    // Capture elements on both sides of the pivot
    vector<int> left = getPart(arr, low, j - 1);
    vector<int> right = getPart(arr, j + 1, high);

    // Record partition step
    quickSortSteps.push_back({
        "partition",
        "Partitioning " + path,
        pivot,
        j,
        left,
        right,
        arr
    });

    return j;
}

// recursive Quick Sort logic
void quickSort(
    vector<int>& arr,
    int low,
    int high,
    const string& path
) {
    if (low > high) {
        return;
    }

    // Base case: one element
    if (low == high) {

        vector<int> single = {arr[low]};

        quickSortSteps.push_back({
            "base",
            "Base case: " + path + " contains one element",
            arr[low],
            low,
            {},
            {},
            arr
        });

        return;
    }

    int pivotIndex = partition(
        arr,
        low,
        high,
        path
    );

    // Recursively sort left partition
    if (pivotIndex - 1 >= low) {
        quickSort(
            arr,
            low,
            pivotIndex - 1,
            "Left of " + path
        );
    }

    // Recursively sort right partition
    if (pivotIndex + 1 <= high) {
        quickSort(
            arr,
            pivotIndex + 1,
            high,
            "Right of " + path
        );
    }
}

// Public function called by the runner
void runQuickSort(vector<int>& arr) {

    quickSortSteps.clear();

    if (!arr.empty()) {
        quickSort(
            arr,
            0,
            static_cast<int>(arr.size()) - 1,
            "main array"
        );
    }

    quickSortSteps.push_back({
        "sorted",
        "Quick Sort completed",
        0,
        -1,
        {},
        {},
        arr
    });
}

// Print all steps as JSON
void printQuickSortStepsJSON() {

    cout << "[";

    for (size_t i = 0; i < quickSortSteps.size(); i++) {

        const QuickSortStep& step = quickSortSteps[i];

        cout << "{";

        cout << "\"type\":\""
             << step.type << "\",";

        cout << "\"description\":\""
             << step.description << "\",";

        cout << "\"pivot\":"
             << step.pivot << ",";

        cout << "\"pivotIndex\":"
             << step.pivotIndex << ",";

        cout << "\"left\":";
        printVector(step.left);
        cout << ",";

        cout << "\"right\":";
        printVector(step.right);
        cout << ",";

        cout << "\"result\":";
        printVector(step.result);

        cout << "}";

        if (i < quickSortSteps.size() - 1) {
            cout << ",";
        }
    }

    cout << "]";
}
