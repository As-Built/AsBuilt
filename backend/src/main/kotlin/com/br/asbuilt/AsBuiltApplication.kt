package com.br.asbuilt

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class AsBuiltApplication

fun main(args: Array<String>) {
	runApplication<AsBuiltApplication>(*args)
}
