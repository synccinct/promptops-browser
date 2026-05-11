import { zodToJsonSchema } from "zod-to-json-schema";
import { SuggestionEnvelopeSchema } from "../src/suggestion-envelope";
import { PromptStructureSchema } from "../src/prompt-structure";
import * as fs from "fs";
import * as path from "path";

const schemas = [
  { name: "suggestion-envelope", schema: SuggestionEnvelopeSchema },
  { name: "prompt-structure", schema: PromptStructureSchema },
];

const outputDir = path.join(__dirname, "../src/json-schema");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

schemas.forEach(({ name, schema }) => {
  const jsonSchema = zodToJsonSchema(schema, name);
  const outputPath = path.join(outputDir, `${name}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(jsonSchema, null, 2));
  console.log(`Generated ${outputPath}`);
});
