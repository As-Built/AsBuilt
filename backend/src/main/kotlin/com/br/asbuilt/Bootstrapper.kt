package com.br.asbuilt

import com.br.asbuilt.roles.Role
import com.br.asbuilt.roles.RoleRepository
import com.br.asbuilt.unitMeasurement.UnitMeasurement
import com.br.asbuilt.unitMeasurement.UnitMeasurementRepository
import com.br.asbuilt.users.User
import com.br.asbuilt.users.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.ApplicationListener
import org.springframework.context.event.ContextRefreshedEvent
import org.springframework.stereotype.Component

@Component
class Bootstrapper(
    val userRepository: UserRepository,
    val roleRepository: RoleRepository,
    val unitMeasurementRepository: UnitMeasurementRepository,
    @Qualifier("defaultAdmin") val adminUser: User
): ApplicationListener<ContextRefreshedEvent> {
    override fun onApplicationEvent(event: ContextRefreshedEvent) {
        val adminRole =
            roleRepository.findByName("ADMIN") ?:
            roleRepository.save(Role(name = "ADMIN", description = "System administrator"))
                .also {
                    log.info("ADMIN role created")
                }
            roleRepository.findByName("CONFERENTE") ?:
            roleRepository.save(Role(name = "CONFERENTE", description = "Quality technician"))
                .also {
                    log.info("CONFERENTE role created")
                }
            roleRepository.findByName("FUNCIONARIO") ?:
            roleRepository.save(Role(name = "FUNCIONARIO", description = "Employee"))
                .also {
                    log.info("FUNCIONARIO role created")
                }

        if (userRepository.findByRole("ADMIN").isEmpty()) {
            adminUser.roles.add(adminRole)
            userRepository.save(adminUser)
            log.info("Administrator created")
        }

        //Insere as unidades de medida padrão no banco de dados caso não existam
        if (unitMeasurementRepository.findAll().isEmpty()) {
            unitMeasurementRepository.save(UnitMeasurement(name = "m", description = "Metro linear"))
            unitMeasurementRepository.save(UnitMeasurement(name = "m²", description = "Metro quadrado"))
            unitMeasurementRepository.save(UnitMeasurement(name = "m³", description = "Metro cúbico"))
            unitMeasurementRepository.save(UnitMeasurement(name = "kg", description = "Quilograma"))
            unitMeasurementRepository.save(UnitMeasurement(name = "hr", description = "Hora"))
            log.info("Unit of measurement created")
        }
    }

    companion object {
        private val log = LoggerFactory.getLogger(Bootstrapper::class.java)
    }
}