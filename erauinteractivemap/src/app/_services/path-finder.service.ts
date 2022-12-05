import { Injectable } from '@angular/core';
import { LatLng, Point } from 'leaflet';
import { AStarFinder } from 'astar-typescript';
import { IPoint } from 'astar-typescript/dist/interfaces/astar.interfaces';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PathFinderService {

    //2d pixel array
    pixelArray: any[][] = [];
    arrayOfNonTransparentPixels: IPoint[] = [];
    imgLoaded: Subject<any> = new Subject<any>();
    //pathLoaded: Subject<any> = new Subject<any>();
    private aStarInstance?: AStarFinder;
    constructor() { }
    //CREATE A NODE CLASS FOR A STAR ALGORITHM


    //given a picture assets/images/mapWalkLayer.png find the non transparent pixels and save them to an 2d array
    //this is used to find the pixels that are walkable on the map

    findPixels(): any {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let img = new Image();
        img.src = 'assets/images/walkyPixels.png';
        img.onload = (load) => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            let imgData = ctx?.getImageData(0, 0, img.width, img.height);
            let data = imgData?.data;
            let width = imgData?.width;
            let height = imgData?.height;
            let pixelArray: number[][] = [];
            console.log(width, " width", height, " height");
            if (data && width && height) {
                for (let i = height; i > 0; i--) {
                    let row: number[] = [];
                    for (let j = 0; j < width; j++) {
                        let index = (i * width + j) * 4;
                        let r = data[index];
                        let g = data[index + 1];
                        let b = data[index + 2];
                        let a = data[index + 3];
                        if (a > 0) {
                            row.push(0);
                            this.arrayOfNonTransparentPixels.push(new Point(j, i) as IPoint);
                        } else {
                            row.push(1);
                        }
                    }
                    pixelArray.push(row);
                }
                this.pixelArray = pixelArray;
                //this.findOptimalPath(new Point(0, 0) as IPoint, new Point(9, 9) as IPoint);
            }
            this.imgLoaded.next(load);
        }
    }

    findOptimalPath(start: IPoint, end: IPoint): any {

        console.log("start", start, "end", end);
        console.log(this.pixelArray);
        this.aStarInstance = new AStarFinder({
            grid: {
                matrix: this.pixelArray
            },
        });
        let path = this.aStarInstance.findPath(start, end);
        console.log(path);
        return path;
        //this.pathLoaded.next(path);
    }

    findNearestWalkablePixel(point: IPoint): IPoint {
        let nearestPoint = this.arrayOfNonTransparentPixels[0];
        let shortestDistance = this.distanceBetweenPoints(point, nearestPoint);
        for (let i = 1; i < this.arrayOfNonTransparentPixels.length; i++) {
            let distance = this.distanceBetweenPoints(point, this.arrayOfNonTransparentPixels[i]);
            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearestPoint = this.arrayOfNonTransparentPixels[i];
            }
        }
        return nearestPoint;
    }

    private distanceBetweenPoints(point1: IPoint, point2: IPoint): number {
        let x = point1.x - point2.x;
        let y = point1.y - point2.y;
        return Math.sqrt(x * x + y * y);
    }


}

