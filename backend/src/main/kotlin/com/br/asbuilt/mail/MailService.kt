package com.br.asbuilt.mail

import org.hibernate.query.sqm.tree.SqmNode.log
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service

@Service
class MailService {

    @Autowired
    private lateinit var javaMailSender: JavaMailSender

    @Value("\${spring.mail.username}")
    private lateinit var remetente: String

    public fun enviarEmailTexto(destinatario: String, assunto: String, mensagem: String): String {
        try {
            var simpleMailMessage: SimpleMailMessage = SimpleMailMessage()
            simpleMailMessage.from = remetente
            simpleMailMessage.setTo(destinatario)
            simpleMailMessage.subject = assunto
            simpleMailMessage.text = mensagem
            javaMailSender.send(simpleMailMessage)
            log.info("Email enviado para $destinatario")
            return "Email enviado!"
        } catch (e: Exception) {
            log.warn("Erro ao enviar e-mail para $destinatario", e)
            return "Erro ao enviar e-mail!"
        }
    }
}