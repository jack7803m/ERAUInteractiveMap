import { Injectable } from '@angular/core';
import { Point } from 'leaflet';

@Injectable({
    providedIn: 'root'
})
export class PixelFinderService {

    //2d pixel array
    pixelArray: number[][] = [];
    arrayOfNonTransparentPixels: Point[] = [];
    constructor() { }
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

}
