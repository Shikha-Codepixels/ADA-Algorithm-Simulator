#ifndef E998BF8D_48E4_464A_97E8_C4FE9ED32A19
#define E998BF8D_48E4_464A_97E8_C4FE9ED32A19

#ifndef KNAPSACK_H
#define KNAPSACK_H

#include <vector>
#include <string>

struct KnapsackStep {
    int item;
    int capacity;
    int value;
    int excludeValue;
    int includeValue;
    std::string decision;
};

extern std::vector<KnapsackStep> knapsackSteps;

void runKnapsack(
    const std::vector<int>& weights,
    const std::vector<int>& values,
    int capacity
);

void printKnapsackStepsJSON();

#endif


#endif /* E998BF8D_48E4_464A_97E8_C4FE9ED32A19 */
