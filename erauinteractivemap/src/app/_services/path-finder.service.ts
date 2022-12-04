import { Injectable } from '@angular/core';
import { Point } from 'leaflet';

@Injectable({
    providedIn: 'root'
})
export class PathFinderService {

    //2d pixel array
    pixelArray: number[][] = [];
    arrayOfNonTransparentPixels: Point[] = [];
    constructor() { }

    //CREATE A NODE CLASS FOR A STAR ALGORITHM


    //given a picture assets/images/mapWalkLayer.png find the non transparent pixels and save them to an 2d array
    //this is used to find the pixels that are walkable on the map

    findPixels() {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let img = new Image();
        img.src = 'assets/images/mapWalkLayer.png';
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            let imgData = ctx?.getImageData(0, 0, img.width, img.height);
            let data = imgData?.data;
            let width = imgData?.width;
            let height = imgData?.height;
            let pixelArray: number[][] = [];
            console.log(data, " data", width, " width", height, " height");
            if (data && width && height) {
                for (let i = 0; i < height; i++) {
                    let row: number[] = [];
                    for (let j = 0; j < width; j++) {
                        let index = (i * width + j) * 4;
                        let r = data[index];
                        let g = data[index + 1];
                        let b = data[index + 2];
                        let a = data[index + 3];
                        if (a > 0) {
                            row.push(1);
                            this.arrayOfNonTransparentPixels.push(new Point(j, i));
                        } else {
                            row.push(0);
                        }
                    }
                    pixelArray.push(row);
                }
                this.pixelArray = pixelArray;
                console.log("made past IF");
            }
            console.log(this.pixelArray.length + " pixel array");
            console.log(this.arrayOfNonTransparentPixels.length + " arrayOfNonTransparentPixels");
        }
    }


    //TODO: Unsure to use this method or not


    //A* path finding algorithm
    /**
     * Finds the shortest distance between two nodes using the A-star (A*) algorithm
     * @param graph an adjacency-matrix-representation of the graph where (x,y) is the weight of the edge or 0 if there is no edge.
     +++++ See this link https://mathworld.wolfram.com/AdjacencyMatrix.html
     * @param heuristic an estimation of distance from node x to y that is guaranteed to be lower than the actual distance. E.g. straight-line distance
     +++++ See this Link https://brilliant.org/wiki/a-star-search/
     * @param start the node to start from.
     *
     * @param goal the node we're searching for
     *
     * @return The shortest distance to the goal node. Can be easily modified to return the path.
     */
    aStar(graph: any, heuristic: any, start: any, goal: any) {

        //This contains the distances from the start node to all other nodes
        var distances = [];
        //Initializing with a distance of "Infinity"
        for (var i = 0; i < graph.length; i++) distances[i] = Number.MAX_VALUE;
        //The distance from the start node to itself is of course 0
        distances[start] = 0;

        //This contains the priorities with which to visit the nodes, calculated using the heuristic.
        var priorities = [];
        //Initializing with a priority of "Infinity"
        for (var i = 0; i < graph.length; i++) priorities[i] = Number.MAX_VALUE;
        //start node has a priority equal to straight line distance to goal. It will be the first to be expanded.
        priorities[start] = heuristic[start][goal];

        //This contains whether a node was already visited
        var visited = [];

        //While there are nodes left to visit...
        while (true) {

            // ... find the node with the currently lowest priority...
            var lowestPriority = Number.MAX_VALUE;
            var lowestPriorityIndex = -1;
            for (var i = 0; i < priorities.length; i++) {
                //... by going through all nodes that haven't been visited yet
                if (priorities[i] < lowestPriority && !visited[i]) {
                    lowestPriority = priorities[i];
                    lowestPriorityIndex = i;
                }
            }

            if (lowestPriorityIndex === -1) {
                // There was no node not yet visited --> Node not found
                return -1;
            } else if (lowestPriorityIndex === goal) {
                // Goal node found
                // console.log("Goal node found!");
                return distances[lowestPriorityIndex];
            }

            // console.log("Visiting node " + lowestPriorityIndex + " with currently lowest priority of " + lowestPriority);

            //...then, for all neighboring nodes that haven't been visited yet....
            for (var i = 0; i < graph[lowestPriorityIndex].length; i++) {
                if (graph[lowestPriorityIndex][i] !== 0 && !visited[i]) {
                    //...if the path over this edge is shorter...
                    if (distances[lowestPriorityIndex] + graph[lowestPriorityIndex][i] < distances[i]) {
                        //...save this path as new shortest path
                        distances[i] = distances[lowestPriorityIndex] + graph[lowestPriorityIndex][i];
                        //...and set the priority with which we should continue with this node
                        priorities[i] = distances[i] + heuristic[i][goal];
                        // console.log("Updating distance of node " + i + " to " + distances[i] + " and priority to " + priorities[i]);
                    }
                }
            }

            // Lastly, note that we are finished with this node.
            visited[lowestPriorityIndex] = true;
            //console.log("Visited nodes: " + visited);
            //console.log("Currently lowest distances: " + distances);

        }
    };


}

export class Node {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
