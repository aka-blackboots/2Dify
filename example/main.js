import TwoDify from '../dist/src/';

const container = document.getElementById('three-container');

const twoDify = new TwoDify(container);
twoDify.createDebugCube();
console.log(twoDify);

