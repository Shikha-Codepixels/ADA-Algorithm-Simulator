#include <iostream>
#include "sorting.h"
#include <string>
using namespace std;

vector<Step> steps;


void merge(vector<int>& arr, int left, int mid, int right) {

    vector<int> L(
        arr.begin() + left,
        arr.begin() + mid + 1
    );

    vector<int> R(
        arr.begin() + mid + 1,
        arr.begin() + right + 1
    );

    int i = 0;
    int j = 0;
    int k = left;


    while (i < L.size() && j < R.size()) {

        if (L[i] <= R[j]) {

            arr[k++] = L[i++];

        } else {

            arr[k++] = R[j++];

        }
    }


    while (i < L.size()) {

        arr[k++] = L[i++];

    }


    while (j < R.size()) {

        arr[k++] = R[j++];

    }


    vector<int> merged(
        arr.begin() + left,
        arr.begin() + right + 1
    );

    steps.push_back({
        "merge",
        "Merging",
        {},
        {},
        merged
    });
}


void mergeSort(
    vector<int>& arr,
    int left,
    int right,
    string position
){

    if (left >= right)
        return;


    int mid =
        left + (right - left) / 2;

    vector<int> L(
        arr.begin() + left,
        arr.begin() + mid + 1
    );

    vector<int> R(
        arr.begin() + mid + 1,
        arr.begin() + right + 1
    );

    string description = "Dividing " + position;

    steps.push_back({
        "divide",
        description,
        L,
        R,
        {}
    });

    mergeSort(
        arr,
        left,
        mid,
        "Left of " + position
    );


    mergeSort(
        arr,
        mid + 1,
        right,
        "Right of " + position
    );


    merge(
        arr,
        left,
        mid,
        right
    );
}


void printVector(
    const vector<int>& values
){

    cout << "[";

    for (int i = 0; i < values.size(); i++) {

        cout << values[i];

        if (i < values.size() - 1)
            cout << ",";

    }

    cout << "]";
}


void printStepsJSON() {

    cout << "[";


    for (int i = 0; i < steps.size(); i++) {

        Step& step = steps[i];


        cout << "{";

        cout << "\"type\":\""
             << step.type
             << "\",";

        cout << "\"description\":\""
             << step.description
             << "\"";


        if(step.type == "divide"){

            cout << ",\"left\":";
            printVector(step.left);

            cout << ",\"right\":";
            printVector(step.right);

        }


        else if(step.type == "merge"){

            cout << ",\"result\":";
            printVector(step.result);

        }


        cout << "}";


        if (i < steps.size() - 1)
            cout << ",";

    }


    cout << "]";

    cout << endl;
}

void runMergeSort(vector<int>& arr){
    steps.clear();
    if(!arr.empty()){
        mergeSort(arr, 0, static_cast<int>(arr.size()) - 1);
    }
}
