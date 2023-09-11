import * as THREE from 'three';

type TimelineObject = {
    date: Date;
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
};

class TimeLineFactor {
    public create(object3D: THREE.Object3D, date: Date): TimelineObject {
        object3D.updateMatrix();

        const timelineObject: TimelineObject = {
            date: date,
            position: object3D.position.clone(),
            rotation: object3D.rotation.clone(),
            scale: object3D.scale.clone(),
        };

        return timelineObject;
    }
}

const factory = new TimeLineFactor();

function _createTimelineObject(this: THREE.Object3D, date: Date) {
    const timelineObject = factory.create(this, date);
    this.timeline.push(timelineObject);
}

export function initTimeline(this: THREE.Object3D, date = new Date()): void {
    // @ts-ignore
    this.hasTimeline = true;

    this.timeline = [];
    this.timelineDate = date;

    _createTimelineObject.call(this, date);
}

/**
 *
 * @param this
 * @param date
 */
export function setTimelineDate(this: THREE.Object3D, date: Date): void {
    this.timelineDate = date;

    // Check if the date exists in the timeline
    // const timelineObject = this.timeline.find((timelineObject) => {
    //     return timelineObject.date.getTime() === date.getTime();
    // });

    let timelineObject: TimelineObject | null = null;

    for (let i = 0; i < this.timeline.length; i++) {
        const object = this.timeline[i];
        if (object.date.getTime() === date.getTime()) {
            timelineObject = object;
            break;
        }
    }

    if (timelineObject) {
        this.position.copy(timelineObject.position);
        this.rotation.copy(timelineObject.rotation);
        this.scale.copy(timelineObject.scale);
    } else {
        _createTimelineObject.call(this, date);
    }

    this.updateMatrix();
}

export function updateTimeline(this: THREE.Object3D): void {
    // Check if the date exists in the timeline
    const timelineObject = this.timeline.find((timelineObject) => {
        return timelineObject.date.getTime() === this.timelineDate.getTime();
    });

    if (timelineObject) {
        timelineObject.position.copy(this.position);
        timelineObject.rotation.copy(this.rotation);
        timelineObject.scale.copy(this.scale);
    } else {
        _createTimelineObject.call(this, this.timelineDate);
    }
}

declare module 'three/src/core/Object3D.js' {
    export interface Object3D {
        readonly hasTimeline: boolean;
        timelineDate: Date;
        timeline: TimelineObject[];
        initTimeline: typeof initTimeline;
        setTimelineDate: typeof setTimelineDate;
        updateTimeline: typeof updateTimeline;
    }
}
