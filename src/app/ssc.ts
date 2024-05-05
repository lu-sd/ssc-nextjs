// type CsvSection = { [key: string]: string }
type headSection = Record<string, Record<string, string>> // { [sectionName: string]: CsvSection }

export function parseCsv(csvString: string): [headSection, string[][]] {
  const sections: headSection = {}
  const lines = csvString.split('\n')
  const dataSection: string[][] = []
  let currentSection = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()

    if (trimmedLine.startsWith('[')) {
      currentSection = trimmedLine.split(',')[0]
      if (currentSection === '[Data]') continue
      sections[currentSection] = {}
    } else {
      const splitLine = trimmedLine.split(',') //.map((item) => item.trim())

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
          `${sampleID}@lane${lane}`, // convert to sampleID@lane as key
          `${index1Sequence}:${index2Sequence}`,
          `${lane}`,
          `${index1Sequence}`,
          `${index2Sequence}`,
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
  headSection: headSection,
  dataSection: string[][]
): ValidationResult {
  const validationResult: ValidationResult = {
    valid: true,
    message: [
      // { section: '[Header]', details: [] },
      // { section: '[Settings]', details: [] },
      { section: '[Data]', details: [] },
    ],
  }

  // for (const key of Object.keys(headSection)) {
  //   switch (key) {
  //     case '[Header]':
  //       if (!headSection[key]['Date']) {
  //         validationResult.valid = false
  //         validationResult.message[0].details.push('Date is required.')
  //       }
  //       break
  //     case '[Settings]':
  //       if (!headSection[key]['Read1']) {
  //         validationResult.valid = false
  //         validationResult.message[1].details.push('Read1 is required.')
  //       }
  //       break
  //   }
  // }

  if (dataSection.length === 0) {
    validationResult.valid = false
    validationResult.message[2].details.push('Data section is empty.')
  } else {
    // check for duplicate sampleID (sampleID@lane should be unique)
    const sampleID_count = new Map<string, number>()

    for (const [sampleID_lane, _] of dataSection) {
      sampleID_count.set(
        sampleID_lane,
        (sampleID_count.get(sampleID_lane) ?? 0) + 1
      )
    }

    for (const [sampleID_Lane, count] of sampleID_count.entries()) {
      if (count > 1) {
        validationResult.valid = false
        validationResult.message[0].details.push(
          `Duplicate sampleID found: ${sampleID_Lane} is used ${count} times.`
        )
      }
    }
    // check for duplicate index (index1:index2 should be unique for each lane)
    // check for consistent index length (index1:index2 should have the same length for all samples in the data section)
    const indexSeq = new Map<string, number>()
    const indexLength = new Map<string, number>()
    for (const [sampleID_Lane, index1_index2] of dataSection) {
      const [_, lane] = sampleID_Lane.split('@')
      indexSeq.set(
        `${lane}-${index1_index2}`,
        (indexSeq.get(`${lane}-${index1_index2}`) ?? 0) + 1
      )
      indexLength.set(sampleID_Lane, index1_index2.length - 1)
    }

    for (const [index, count] of indexSeq.entries()) {
      if (count > 1) {
        validationResult.valid = false
        validationResult.message[0].details.push(
          `Duplicate index found: ${index} is used ${count} times.`
        )
      }
    }

    // lane need to be 1-4
    const lanes = new Set(dataSection.map(([, , lane]) => lane))
    const standardLanes = new Set(['1', '2', '3', '4'])
    const invalidLanes = new Set(
      [...lanes].filter((x) => !standardLanes.has(x))
    )
    if (invalidLanes.size > 0) {
      validationResult.valid = false
      validationResult.message[0].details.push(
        `Invalid lane ID "${[...invalidLanes].join(', ')}" found. (Only lane 1-4 are allowed.)`
      )
    }

    // index sequence only contain A, T, C, G
    const invalidIndex: string[][] = []
    for (const [sampleID_Lane, , , index1, index2] of dataSection) {
      const invalidIndex1 = new Set(
        index1
          .toUpperCase()
          .split('')
          .filter((x) => !['A', 'T', 'C', 'G'].includes(x))
      )
      const invalidIndex2 = new Set(
        index2
          .toUpperCase()
          .split('')
          .filter((x) => !['A', 'T', 'C', 'G'].includes(x))
      )
      if (invalidIndex1.size > 0 || invalidIndex2.size > 0) {
        let wrongChar = ''
        const invalid = new Set([...invalidIndex1, ...invalidIndex2])
        for (const char of invalid) {
          wrongChar += char
        }
        invalidIndex.push([sampleID_Lane, wrongChar])
      }
    }

    if (invalidIndex.length > 0) {
      validationResult.valid = false
      for (const [sampleID_Lane, wrongChar] of invalidIndex) {
        validationResult.message[0].details.push(
          `${sampleID_Lane} contains invalid characters: "${wrongChar}"`
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

      validationResult.message[0].details.push(
        `Index length is not consistent: ${example1[0]} index length is ${uniqueLength[0]} while ${example2[0]} index length is ${uniqueLength[1]}.`
      )
    }
  }

  return validationResult
}
