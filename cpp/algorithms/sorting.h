#ifndef FDB8CACA_F1FC_444C_9003_A7162A9E4A1B
#define FDB8CACA_F1FC_444C_9003_A7162A9E4A1B
#ifndef SORTING_H
#define SORTING_H

#include <string>
#include <vector>

struct Step {
    std::string type;
    std::string description;
    std::vector<int> left;
    std::vector<int> right;
    std::vector<int> result;
};

extern std::vector<Step> steps;

void merge(std::vector<int>& arr, int left, int mid, int right);

void mergeSort(
    std::vector<int>& arr,
    int left,
    int right,
    std::string position = "main array"
);

void runMergeSort(std::vector<int>& arr);

void printStepsJSON();

#endif
#endif 
