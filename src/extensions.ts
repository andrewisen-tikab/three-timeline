import * as THREE from 'three';
import type { TimelineObject, TimelineJSONObject } from './types';

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

const _toJSON = THREE.Object3D.prototype.toJSON;

/**
 * Convert the object to three.js {@link https://github.com/mrdoob/three.js/wiki/JSON-Object-Scene-format-4 | JSON Object/Scene format}.
 * @param meta Object containing metadata such as materials, textures or images for the object.
 */
export function toJSON(this: THREE.Object3D, meta: any) {
    const data = _toJSON.call(this, meta);

    if (this.hasTimeline == null) return data;

    // Convert the timeline to JSON

    data.object.hasTimeline = true;
    data.object.timelineDate = this.timelineDate.toJSON();

    data.object.timeline = this.timeline.map((timelineObject) => {
        // Represent the date as string
        const object: TimelineJSONObject = {
            date: timelineObject.date.toJSON(),
            position: timelineObject.position,
            rotation: timelineObject.rotation,
            scale: timelineObject.scale,
        };
        return object;
    });

    return data;
}

const _parse = THREE.ObjectLoader.prototype.parse;

export function parse(
    this: THREE.ObjectLoader,
    json: any,
    onLoad?: (object: THREE.Object3D) => void,
): THREE.Object3D {
    const object = _parse.call(this, json, onLoad);

    // Create dates from strings

    if (json.object.hasTimeline) {
        object.timelineDate = new Date(json.object.timelineDate);

        object.timeline = json.object.timeline.map((timelineJSONObject: TimelineJSONObject) => {
            const timelineObject: TimelineObject = {
                date: new Date(timelineJSONObject.date),
                position: timelineJSONObject.position,
                rotation: timelineJSONObject.rotation,
                scale: timelineJSONObject.scale,
            };

            return timelineObject;
        });
    }

    return object;
}

export type AbstractTimelineObject3D = {
    readonly hasTimeline: boolean;
    timelineDate: Date;
    timeline: TimelineObject[];
    initTimeline: typeof initTimeline;
    setTimelineDate: typeof setTimelineDate;
    updateTimeline: typeof updateTimeline;
};

declare module 'three/src/core/Object3D.js' {
    export interface Object3D extends AbstractTimelineObject3D {}
}
