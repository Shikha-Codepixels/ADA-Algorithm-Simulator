#ifndef B9DC412A_22F6_4233_A362_E4F13838C4A3
#define B9DC412A_22F6_4233_A362_E4F13838C4A3

#ifndef QUICKSORT_H
#define QUICKSORT_H

#include <string>
#include <vector>

struct QuickSortStep {
    std::string type;
    std::string description;
    int pivot;
    int pivotIndex;
    std::vector<int> left;
    std::vector<int> right;
    std::vector<int> result;
};

extern std::vector<QuickSortStep> quickSortSteps;

void runQuickSort(std::vector<int>& arr);
void printQuickSortStepsJSON();

#endif


#endif /* B9DC412A_22F6_4233_A362_E4F13838C4A3 */
