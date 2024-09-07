package com.br.asbuilt.security

import com.br.asbuilt.azureBlobStorage.AzureBlobStorageResourceProvider
import com.br.asbuilt.azureBlobStorage.controller.AzureBlobStorageController
import com.br.asbuilt.users.User
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType
import io.swagger.v3.oas.annotations.security.SecurityScheme
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.PropertySource
import org.springframework.http.HttpMethod
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy.STATELESS
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher
import org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter
import org.springframework.web.servlet.handler.HandlerMappingIntrospector

@Configuration
@EnableMethodSecurity
@SecurityScheme(
    name = "AsBuilt",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT"
)
@PropertySource("classpath:/security.properties")
class SecurityConfig(
    val jwtTokenFilter: JwtTokenFilter
) {
    @Bean
    fun mvc(introspector: HandlerMappingIntrospector) = MvcRequestMatcher.Builder(introspector)

    @Bean
    fun filterChain(security: HttpSecurity, mvc: MvcRequestMatcher.Builder) =
        security.cors(Customizer.withDefaults())
            .csrf { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(STATELESS) }
            .exceptionHandling {
                it.authenticationEntryPoint { _, res, ex ->
                    res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "UNAUTHORIZED")
                        .also { log.warn("Authorization failed", ex) }
                }
            }
            .headers { header -> header.frameOptions { it.disable() } }
            .authorizeHttpRequests { requests ->
                requests
                    .requestMatchers(antMatcher(HttpMethod.GET)).permitAll()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/users")).permitAll()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/users/login")).permitAll()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/users/recuperarSenha/**")).permitAll()
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/tasks")).permitAll()
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/tasks/**")).permitAll()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/tasks")).hasAnyRole("ADMIN", "CONFERENTE")
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/tasks/insertTask")).hasAnyRole("ADMIN", "CONFERENTE")
                    .requestMatchers(mvc.pattern(HttpMethod.PATCH, "/tasks/updateTask")).hasAnyRole("ADMIN", "CONFERENTE")
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/tasks/deleteTask/**")).hasAnyRole("ADMIN", "CONFERENTE")
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/costCenter")).permitAll()
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/costCenter/**")).permitAll()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/costCenter/insertCostCenter")).hasRole("ADMIN")
                    .requestMatchers(mvc.pattern(HttpMethod.PATCH, "/costCenter/updateCostCenter")).hasRole("ADMIN")
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/costCenter/deleteCostCenter/**")).hasRole("ADMIN")
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/address")).permitAll()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/address/insertAddress")).permitAll()
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/address")).permitAll()
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/builder")).permitAll()
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/builder/**")).permitAll()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/builder/insertBuilder")).hasRole("ADMIN")
                    .requestMatchers(mvc.pattern(HttpMethod.PATCH, "/builder/updateBuilder")).hasRole("ADMIN")
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/builder/deleteBuilder/**")).hasRole("ADMIN")
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/location")).permitAll()
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/location/**")).permitAll()
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/location/findLocationId/**")).permitAll()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/location/insertLocation")).hasAnyRole("ADMIN", "CONFERENTE")
                    .requestMatchers(mvc.pattern(HttpMethod.PATCH, "/location/updateLocation")).hasAnyRole("ADMIN", "CONFERENTE")
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/location/deleteLocation/**")).hasAnyRole("ADMIN", "CONFERENTE")
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/unitMeasurement")).permitAll()
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/unitMeasurement/**")).permitAll()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/unitMeasurement/insertUnitMeasurement")).hasAnyRole("ADMIN", "CONFERENTE")
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/taskType")).permitAll()
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/taskType/**")).permitAll()
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/taskType/insertTaskType")).hasAnyRole("ADMIN", "CONFERENTE")
                    .requestMatchers(mvc.pattern(HttpMethod.PATCH, "/taskType/updateTaskType")).hasAnyRole("ADMIN", "CONFERENTE")
                    .requestMatchers(mvc.pattern(HttpMethod.DELETE, "/taskType/deleteTaskType/**")).hasAnyRole("ADMIN", "CONFERENTE")
                    .requestMatchers(mvc.pattern(HttpMethod.POST, "/blob/**")).permitAll()
                    .requestMatchers(mvc.pattern(HttpMethod.GET, "/blob/**")).permitAll()
                    .anyRequest().authenticated()
            }
            .addFilterBefore(jwtTokenFilter, BasicAuthenticationFilter::class.java)
            .build()

    @Bean
    fun corsFilter() =
        CorsConfiguration().apply {
            addAllowedHeader("*")
            addAllowedOrigin("*")
            addAllowedMethod("*")
        }.let {
            UrlBasedCorsConfigurationSource().apply {
                registerCorsConfiguration("/**", it)
            }
        }.let { CorsFilter(it) }

    @Bean
    fun bCryptPasswordEncoder(): BCryptPasswordEncoder {
        return BCryptPasswordEncoder()
    }

    @ConfigurationProperties("security.admin")
    @Bean("defaultAdmin")
    fun adminUser() = User()

    companion object {
        private val log = LoggerFactory.getLogger(SecurityConfig::class.java)
    }
}