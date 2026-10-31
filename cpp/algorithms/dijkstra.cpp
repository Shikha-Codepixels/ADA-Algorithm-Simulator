#include <iostream>
#include <climits>
#include <iomanip>
using namespace std;


int minDistance(int dist[], bool visited[], int V) {
    int min = INT_MAX, min_index = -1;

    for (int v = 0; v < V; v++) {
        if (!visited[v] && dist[v] <= min) {
            min = dist[v];
            min_index = v;
        }
    }
    return min_index;
}

void printDistances(int dist[], int V) {
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

void printPath(int parent[], int j) {
    if (parent[j] == -1) {
        cout << j;
        return;
    }
    printPath(parent, parent[j]);
    cout << " -> " << j;
}

void dijkstra(int **graph, int V, int src) {
    int dist[V];
    bool visited[V];
    int parent[V];

    for (int i = 0; i < V; i++) {
        dist[i] = INT_MAX;
        visited[i] = false;
        parent[i] = -1;
    }

    dist[src] = 0;

    for (int count = 0; count < V - 1; count++) {
        int u = minDistance(dist, visited, V);
        visited[u] = true;

        cout << "\nStep " << count + 1 << ": Pick vertex " << u << endl;

        for (int v = 0; v < V; v++) {
            if (!visited[v] && graph[u][v] &&
                dist[u] != INT_MAX &&
                dist[u] + graph[u][v] < dist[v]) {

                cout << "Relaxing edge " << u << " -> " << v
                     << " (weight " << graph[u][v] << ")\n";

                dist[v] = dist[u] + graph[u][v];
                parent[v] = u;

                cout << "Updated distance of " << v
                     << " = " << dist[v] << endl;
            }
        }

        printDistances(dist, V);
    }

    cout << "\n--- Shortest Paths from Source " << src << " ---\n";
    for (int i = 0; i < V; i++) {
        cout << "To " << i << ": ";
        printPath(parent, i);
        cout << " (dist = " << dist[i] << ")\n";
    }
}

void dijkstraMenu() {
    int V;
    cout << "\nEnter number of vertices: ";
    cin >> V;

    int **graph = new int*[V];
    for (int i = 0; i < V; i++)
        graph[i] = new int[V];

    cout << "Enter adjacency matrix (0 if no edge):\n";
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) {
            cin >> graph[i][j];
        }
    }

    int src;
    cout << "Enter source vertex: ";
    cin >> src;

    cout << "\n--- Dijkstra's Algorithm (Step-by-Step) ---\n";
    dijkstra(graph, V, src);

    // free memory
    for (int i = 0; i < V; i++)
        delete[] graph[i];
    delete[] graph;
}
