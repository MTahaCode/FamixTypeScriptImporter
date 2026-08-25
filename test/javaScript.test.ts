import { Importer } from '../src/analyze';
import { project, exportProjectSourceFilesForEndtoEndPharoTests } from './testUtils';

const importer = new Importer();

project.createSourceFile("avaScript.js",
`class A {}`);

exportProjectSourceFilesForEndtoEndPharoTests(project, __filename);

const fmxRep = importer.famixRepFromProject(project);

describe('Tests for JavaScript source (not TypeScript)', () => {
    it('should return a fmxRep', () => {
        expect(fmxRep).toBeDefined();
    });
});
