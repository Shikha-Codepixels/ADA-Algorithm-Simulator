#include <iostream>
#include <queue>
using namespace std;

struct Node {
    char data;
    int freq;
    Node *left, *right;

    Node(char d, int f) {
        data = d;
        freq = f;
        left = right = nullptr;
    }
};

// Min heap comparator
struct Compare {
    bool operator()(Node* l, Node* r) {
        return l->freq > r->freq;
    }
};

void printCodes(Node* root, string code) {
    if (!root)
        return;

    // Leaf node
    if (root->data != '#') {
        cout << root->data << " : " << code << endl;
    }

    printCodes(root->left, code + "0");
    printCodes(root->right, code + "1");
}

void printTree(Node* root, int depth = 0) {
    if (!root) return;

    for (int i = 0; i < depth; i++)
        cout << "  ";

    if (root->data == '#')
        cout << "[" << root->freq << "]" << endl;
    else
        cout << root->data << "(" << root->freq << ")" << endl;

    printTree(root->left, depth + 1);
    printTree(root->right, depth + 1);
}

void huffmanCoding(char data[], int freq[], int n) {
    priority_queue<Node*, vector<Node*>, Compare> pq;

    // Create leaf nodes
    for (int i = 0; i < n; i++) {
        pq.push(new Node(data[i], freq[i]));
    }

    cout << "\n--- Greedy Merging Steps ---\n";

    // Build Huffman Tree
    while (pq.size() > 1) {
        Node* left = pq.top(); pq.pop();
        Node* right = pq.top(); pq.pop();

        cout << "Picked nodes with freq "
             << left->freq << " and "
             << right->freq << endl;

        Node* merged = new Node('#', left->freq + right->freq);
        merged->left = left;
        merged->right = right;

        cout << "Merged node created with freq "
             << merged->freq << "\n\n";

        pq.push(merged);
    }

    Node* root = pq.top();

    cout << "\n--- Huffman Tree Structure ---\n";
    printTree(root);

    cout << "\n--- Huffman Codes ---\n";
    printCodes(root, "");
}


void huffmanMenu() {
    int n;
    cout << "\nEnter number of characters: ";
    cin >> n;

    char data[n];
    int freq[n];

    cout << "Enter characters:\n";
    for (int i = 0; i < n; i++)
        cin >> data[i];

    cout << "Enter frequencies:\n";
    for (int i = 0; i < n; i++)
        cin >> freq[i];

    huffmanCoding(data, freq, n);
}
