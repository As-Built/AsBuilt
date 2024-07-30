package com.br.asbuilt

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonDeserializer
import com.fasterxml.jackson.databind.node.ArrayNode

class ByteArrayDeserializer : JsonDeserializer<ByteArray>() {
    override fun deserialize(p: JsonParser, ctxt: DeserializationContext): ByteArray {
        return when (val node = p.codec.readTree<ArrayNode>(p)) {
            is ArrayNode -> node.map { it.asInt().toByte() }.toByteArray()
            else -> {
                throw IllegalArgumentException("Expected ArrayNode but got ObjectNode")
            }
        }
    }
}