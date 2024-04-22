// type CsvSection = { [key: string]: string }
type ParsedCsv = Record<string, Record<string, string>> // { [sectionName: string]: CsvSection }

export function parseCsv(csvString: string): [ParsedCsv, [string, string][]] {
  const sections: ParsedCsv = {}
  const lines = csvString.split('\n')
  const dataSection: [string, string][] = []
  let currentSection = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()

    if (trimmedLine.startsWith('[')) {
      currentSection = trimmedLine.split(',')[0]
      if (currentSection === '[Data]') continue
      sections[currentSection] = {}
    } else {
      const splitLine = trimmedLine.split(',').map((item) => item.trim())

      if (currentSection !== '[Data]') {
        const [key, value] = splitLine
        if (key && value && currentSection) {
          sections[currentSection][key] = value
        }
      } else {
        if (splitLine[0] === 'Sample_ID' || splitLine[0] === '') continue
        const sampleID = splitLine[0]
        const index1Sequence = splitLine[2]
        const index2Sequence = splitLine[4]
        const lane = splitLine[5]
        dataSection.push([
          `${sampleID}-lane${lane}`,
          `${index1Sequence}-${index2Sequence}`,
        ])
      }
    }
  }

  return [sections, dataSection]
}

export type ValidationResult = {
  valid: boolean
  message: { section: string; details: string[] }[]
}

export function validateCsv(
  parsedCsv: ParsedCsv,
  dataSection: [string, string][]
): ValidationResult {
  const validationResult: ValidationResult = {
    valid: true,
    message: [
      { section: '[Header]', details: [] },
      { section: '[Settings]', details: [] },
      { section: '[Data]', details: [] },
    ],
  }
  for (const key of Object.keys(parsedCsv)) {
    switch (key) {
      case '[Header]':
        if (!parsedCsv[key]['Date']) {
          validationResult.valid = false
          validationResult.message[0].details.push('Date is required.')
        }
        break
      case '[Settings]':
        if (!parsedCsv[key]['Read1']) {
          validationResult.valid = false
          validationResult.message[1].details.push('Read1 is required.')
        }
        break
    }
  }

  if (dataSection.length === 0) {
    validationResult.valid = false
    validationResult.message[2].details.push('Data section is empty.')
  } else {
    const sampleID_count = new Map<string, number>()
    for (const [sampleID, _] of dataSection) {
      sampleID_count.set(sampleID, (sampleID_count.get(sampleID) || 0) + 1)
    }

    for (const [sampleID, count] of sampleID_count.entries()) {
      if (count > 1) {
        validationResult.valid = false
        validationResult.message[2].details.push(
          `Duplicate sampleID found: ${sampleID} is used ${count} times.`
        )
      }
    }
    const indexSeq = new Map<string, number>()
    const indexLength = new Map<string, number>()
    for (const [sampleID, seq] of dataSection) {
      const [_, lane] = sampleID.split('-')
      indexSeq.set(`${lane}-${seq}`, (indexSeq.get(`${lane}-${seq}`) || 0) + 1)
      indexLength.set(sampleID, seq.length - 1)
    }

    for (const [index, count] of indexSeq.entries()) {
      if (count > 1) {
        validationResult.valid = false
        validationResult.message[2].details.push(
          `Duplicate index found: ${index} is used ${count} times.`
        )
      }
    }
    const uniqueLength = [...new Set([...indexLength.values()])]
    if (uniqueLength.length > 1) {
      const example1 = [...indexLength.entries()].find(
        ([_, value]) => value === uniqueLength[0]
      )!
      const example2 = [...indexLength.entries()].find(
        ([_, value]) => value === uniqueLength[1]
      )!

      validationResult.valid = false
      validationResult.message[2].details.push(
        `Index length is not consistent: ${example1[0]} has length ${uniqueLength[0]} and ${example2[0]} has length ${uniqueLength[1]}.`
      )
    }
  }

  return validationResult
}
