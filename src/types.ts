import * as THREE from 'three';

export type TimelineObject = {
    date: Date;
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
};

export type TimelineJSONObject = Pick<TimelineObject, 'position' | 'rotation' | 'scale'> & {
    date: string;
};
