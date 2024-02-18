package com.br.asbuilt

import com.br.asbuilt.roles.Role
import com.br.asbuilt.roles.RoleRepository
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
    @Qualifier("defaultAdmin") val adminUser: User
): ApplicationListener<ContextRefreshedEvent> {
    override fun onApplicationEvent(event: ContextRefreshedEvent) {
        val adminRole =
            roleRepository.findByName("ADMIN") ?:
            roleRepository.save(Role(name = "ADMIN", description = "System administrator"))
                .also {
                    roleRepository.save(Role(name = "USER", description = "Premium User"))
                    log.info("ADMIN and USER roles created")
                }

        if (userRepository.findByRole("ADMIN").isEmpty()) {
            adminUser.roles.add(adminRole)
            userRepository.save(adminUser)
            log.info("Administrator created")
        }
    }

    companion object {
        private val log = LoggerFactory.getLogger(Bootstrapper::class.java)
    }
}