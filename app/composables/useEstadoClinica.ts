import { site } from '~/config/site'
import { estadoClinica, momentoEnClinica, type EstadoClinica } from '~/utils/horario'

/**
 * Abierto/cerrado calculado con la hora de la clínica. Es `null` en el HTML prerenderizado
 * (no se conoce la hora de la visita) y se calcula al montar; se actualiza cada minuto.
 */
export function useEstadoClinica() {
  const estado = ref<EstadoClinica | null>(null)
  const calcular = () => (estado.value = estadoClinica(momentoEnClinica(new Date(), site.zonaHoraria), site.horario))
  let timer: ReturnType<typeof setInterval> | undefined
  onMounted(() => {
    calcular()
    timer = setInterval(calcular, 60_000)
  })
  onBeforeUnmount(() => clearInterval(timer))
  return estado
}
