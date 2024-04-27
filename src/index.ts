import { Wall } from './elements/wall';

class twoDify {
    private floorElements: any;
    private activeElement: any;
    
    constructor() {
        console.log('twoDify constructor');
    }

    setupEvents() {
        console.log('setupEvents');
    }

    selectElement() {}

    createSimpleWall() {
        const wall = new Wall();
    }
}

export * from './constants';
