import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Entity } from "./entity";
import { EntityTyping } from "./entity_typing";
import { Type } from "./type";

export class ParametricEntityTyping extends EntityTyping {

    public getJSON(): string {
        const json: FamixJSONExporter = new FamixJSONExporter("ParametricEntityTyping", this);
        this.addPropertiesToExporter(json);
        return json.getJSON();
    }

    public addPropertiesToExporter(exporter: FamixJSONExporter): void {
        super.addPropertiesToExporter(exporter);
    }
}
