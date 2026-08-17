import { Importer } from '../src/analyze';
import { ScriptEntity } from '../src/lib/famix/model/famix/script_entity';
import { project, exportProjectSourceFiles } from './testUtils';

const importer = new Importer();
project.createSourceFile("simpleTest.ts",
`console.log("Hello");
`);

exportProjectSourceFiles(project, __filename);

const fmxRep = importer.famixRepFromProject(project);

describe('Tests for simple test', () => {
    
    const scriptEntityList = Array.from(fmxRep._getAllEntitiesWithType('ScriptEntity')) as Array<ScriptEntity>;
    const theFile = scriptEntityList.find(e => e.name === 'simpleTest.ts');
    it("should have one file", () => {
        expect(scriptEntityList?.length).toBe(1);
        expect(theFile).toBeTruthy();
    });
});
