#include <iostream>
#include <vector>
#include <climits>
#include <iomanip>
using namespace std;

struct Edge {
    int u, v, w;
};

void printBellmanDistances(int dist[], int V) {
    cout << "Vertex   Distance from Source\n";
    for (int i = 0; i < V; i++) {
        cout << setw(4) << i << setw(15);
        if (dist[i] == INT_MAX)
            cout << "INF";
        else
            cout << dist[i];
        cout << endl;
    }
    cout << endl;
}

void bellmanFord(int V, int E, vector<Edge>& edges, int src) {
    int dist[V];

    for (int i = 0; i < V; i++)
        dist[i] = INT_MAX;

    dist[src] = 0;

    cout << "\n--- Bellman-Ford Relaxation Steps ---\n";

    // Step-by-step relaxation (V-1 times)
    for (int i = 1; i <= V - 1; i++) {
        cout << "\nIteration " << i << ":\n";

        for (int j = 0; j < E; j++) {
            int u = edges[j].u;
            int v = edges[j].v;
            int w = edges[j].w;

            if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                cout << "Relaxing edge " << u << " -> " << v
                     << " (weight " << w << ")\n";

                dist[v] = dist[u] + w;

                cout << "Updated distance of " << v
                     << " = " << dist[v] << endl;
            }
        }

        printBellmanDistances(dist, V);
    }

    // Negative cycle detection
    for (int j = 0; j < E; j++) {
        int u = edges[j].u;
        int v = edges[j].v;
        int w = edges[j].w;

        if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
            cout << "\nNegative weight cycle detected!\n";
            return;
        }
    }

    cout << "\n No negative weight cycle detected.\n";
}

void bellmanFordMenu() {
    int V, E;
    cout << "\nEnter number of vertices: ";
    cin >> V;

    cout << "Enter number of edges: ";
    cin >> E;

    vector<Edge> edges(E);

    cout << "Enter edges (u v weight):\n";
    for (int i = 0; i < E; i++) {
        cin >> edges[i].u >> edges[i].v >> edges[i].w;
    }
    cout << "Number of iterations = " << (V-1) <<"\n";
    int src;
    cout << "Enter source vertex: ";
    cin >> src;

    cout << "\n--- Bellman-Ford Algorithm ---\n";
    bellmanFord(V, E, edges, src);
}
