
#include <iostream>
#include <vector>
#include <algorithm>
#include "knapsack.h"

using namespace std;

vector<KnapsackStep> knapsackSteps;

void runKnapsack(
    const vector<int>& weights,
    const vector<int>& values,
    int capacity
) {
    knapsackSteps.clear();

    int n = weights.size();

    vector<vector<int>> dp(
        n + 1,
        vector<int>(capacity + 1, 0)
    );

    // Original DP table construction
    for (int i = 0; i <= n; i++) {

        for (int w = 0; w <= capacity; w++) {

            int excludeValue = 0;
            int includeValue = -1;
            string decision;

            if (i == 0 || w == 0) {

                dp[i][w] = 0;
                decision = "base";
                excludeValue = 0;
                includeValue = 0;

            }

            else {

                excludeValue = dp[i - 1][w];

                if (weights[i - 1] <= w) {

                    includeValue =
                        values[i - 1] +
                        dp[i - 1][w - weights[i - 1]];

                    dp[i][w] = max(
                        excludeValue,
                        includeValue
                    );

                }

                else {

                    dp[i][w] = excludeValue;

                }

                decision =
                    includeValue > excludeValue
                    ? "include"
                    : "exclude";
            }

            // Record every DP cell
            knapsackSteps.push_back({
                i,
                w,
                dp[i][w],
                excludeValue,
                includeValue,
                decision
            });
        }
    }
}

// Print execution steps as JSON
void printKnapsackStepsJSON() {

    cout << "[";

    for (size_t i = 0; i < knapsackSteps.size(); i++) {

        const KnapsackStep& step = knapsackSteps[i];

        cout << "{";

        cout << "\"item\":" << step.item << ",";
        cout << "\"capacity\":" << step.capacity << ",";
        cout << "\"value\":" << step.value << ",";
        cout << "\"excludeValue\":" << step.excludeValue << ",";
        cout << "\"includeValue\":" << step.includeValue << ",";
        cout << "\"decision\":\"" << step.decision << "\"";

        cout << "}";

        if (i < knapsackSteps.size() - 1) {
            cout << ",";
        }
    }

    cout << "]";
}
