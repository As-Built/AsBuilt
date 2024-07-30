package com.br.asbuilt

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonDeserializer
import com.fasterxml.jackson.databind.JsonNode

class Uint8ArrayDeserializer : JsonDeserializer<ByteArray>() {
    override fun deserialize(p: JsonParser, ctxt: DeserializationContext): ByteArray {
        val node: JsonNode = p.codec.readTree(p)
        if (node.isArray) {
            val byteList = mutableListOf<Byte>()
            node.forEach { byteList.add(it.asInt().toByte()) }
            return byteList.toByteArray()
        }
        throw IllegalArgumentException("Expected an array of bytes, but got: ${node.nodeType}")
    }
}