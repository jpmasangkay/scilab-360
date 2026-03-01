export function exportSVG(svgElement: SVGSVGElement, filename = "molecule.svg"): void {
  const serializer = new XMLSerializer()
  const source     = serializer.serializeToString(svgElement)
  const blob       = new Blob([source], { type: "image/svg+xml;charset=utf-8" })
  const url        = URL.createObjectURL(blob)
  const a          = document.createElement("a")
  a.href           = url
  a.download       = filename
  a.click()
  URL.revokeObjectURL(url)
}
