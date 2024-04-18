type CsvSection = { [key: string]: string };
type ParsedCsv = { [sectionName: string]: CsvSection };

export function parseCsv(csvString: string): ParsedCsv {
  const sections: ParsedCsv = {};
  const lines = csvString.split("\n");
  let currentSection = "";

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("[")) {
      currentSection = trimmedLine.split(",")[0];
      sections[currentSection] = {};
    } else {
      const [key, value] = trimmedLine.split(",").map((item) => item.trim());
      if (key && value && currentSection) {
        sections[currentSection][key] = value;
      }
    }
  });

  return sections;
}

type ValidationResult = {
  isValid: boolean;
  errors: { [section: string]: string[] };
};

function validateCsv(parsedCsv: ParsedCsv): ValidationResult {
  const validationResult: ValidationResult = { isValid: true, errors: {} };

  // Helper function to add errors
  function addError(section: string, message: string) {
    validationResult.isValid = false;
    if (!validationResult.errors[section]) {
      validationResult.errors[section] = [];
    }
    validationResult.errors[section].push(message);
  }

  // Check required data in Header
  if (!parsedCsv["[Header]"] || !parsedCsv["[Header]"]["Date"]) {
    addError("Header", "Date in Header is required.");
  }

  // Check Read1 in Settings
  if (!parsedCsv["[Settings]"] || !parsedCsv["[Settings]"]["Read1"]) {
    addError("Settings", "Read1 in Settings is required.");
  }

  // Assuming each 'Data' entry is properly formatted
  // if (parsedCsv["Settings"]) {
  //   const settings = parsedCsv["Settings"];
  //   const index1Length = parseInt(settings["Index1"] || "0");
  //   const index2Length = parseInt(settings["Index2"] || "0");
  //   const sumOfIndexLengths = index1Length + index2Length;

  //   Object.entries(parsedCsv["Data"] || {}).forEach(([key, value], index) => {
  //     // Assuming data is structured with index sequences immediately following their IDs
  //     if (
  //       (key.includes("Index1_Sequence") || key.includes("Index2_Sequence")) &&
  //       value
  //     ) {
  //       if (value.length !== sumOfIndexLengths) {
  //         addError(
  //           "Data",
  //           `Sum of Index lengths does not match the sequence lengths for entry ${
  //             Math.floor(index / 6) + 1
  //           }.`
  //         );
  //       }
  //     }
  //   });
  // } else {
  //   addError("Settings", "Index1 and Index2 lengths are required in Settings.");
  // }

  return validationResult;
}
