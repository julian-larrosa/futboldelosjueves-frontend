export function resolveAvatarSeed(nombre: string, id: number): string {
  const normalized = nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return `${normalized}-${id}`
}

export function resolveDorsal(id: number): number {
  return id
}