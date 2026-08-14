import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Entity } from "./entity";
import { Type } from "./type";

export class EntityTyping extends Entity {

    private _typedEntity!: Entity;
    private _declaredType!: Type;

    public getJSON(): string {
        const json: FamixJSONExporter = new FamixJSONExporter("EntityTyping", this);
        this.addPropertiesToExporter(json);
        return json.getJSON();
    }

    public addPropertiesToExporter(exporter: FamixJSONExporter): void {
        super.addPropertiesToExporter(exporter);
        exporter.addProperty("typedEntity", this.typedEntity);
        exporter.addProperty("declaredType", this.declaredType);
    }

    get typedEntity() {
        return this._typedEntity;
    }

    set typedEntity(typedEntity: Entity) {
        this._typedEntity = typedEntity;
    }

    get declaredType() {
        return this._declaredType;
    }

    set declaredType(declaredType: Type) {
        this._declaredType = declaredType;
    }
}
