import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Type } from "./type";
import { Access } from "./access";
import { NamedEntity } from "./named_entity";
import { EntityTyping } from "./entity_typing";
import { ParametricEntityTyping } from "./parametric_entity_typing";

export class StructuralEntity extends NamedEntity {

    private _incomingAccesses: Set<Access> = new Set();

    public addIncomingAccess(incomingAccess: Access): void {
        if (!this._incomingAccesses.has(incomingAccess)) {
            this._incomingAccesses.add(incomingAccess);
            incomingAccess.variable = this;
        }
    }

    // private _declaredType!: Type;
    private _typing!: EntityTyping | ParametricEntityTyping;

    public getJSON(): string {
        const json: FamixJSONExporter = new FamixJSONExporter("StructuralEntity", this);
        this.addPropertiesToExporter(json);
        return json.getJSON();
    }

    public addPropertiesToExporter(exporter: FamixJSONExporter): void {
        super.addPropertiesToExporter(exporter);
        exporter.addProperty("incomingAccesses", this.incomingAccesses);
        exporter.addProperty("typing", this.typing);
        // exporter.addProperty("declaredType", this.declaredType);
    }

    get incomingAccesses() {
        return this._incomingAccesses;
    }

    get typing() {
        return this._typing;
    }

    set typing(typing: EntityTyping | ParametricEntityTyping) {
        this._typing = typing;
    }

    // get declaredType() {
    //     return this._declaredType;
    // }

    // set declaredType(declaredType: Type) {
    //     this._declaredType = declaredType;
    //     declaredType.addStructureWithDeclaredType(this);
    // }
}
