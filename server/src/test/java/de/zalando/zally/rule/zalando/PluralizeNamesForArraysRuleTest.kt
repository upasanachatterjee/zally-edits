package de.zalando.zally.rule.zalando

import de.zalando.zally.getFixture
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test

class PluralizeNamesForArraysRuleTest {

    private val rule = PluralizeNamesForArraysRule()

    @Test
    fun positiveCase() {
        val swagger = getFixture("pluralizeArrayNamesValid.json")
        assertThat(rule.validate(swagger)).isNull()
    }

    @Test
    fun negativeCase() {
        val swagger = getFixture("pluralizeArrayNamesInvalid.json")
        val result = rule.validate(swagger)!!
        assertThat(result.paths).hasSameElementsAs(listOf("/definitions/Pet"))
        assertThat(result.description).contains("name", "tag")
    }

    @Test
    fun positiveCaseSpp() {
        val swagger = getFixture("api_spp.json")
        assertThat(rule.validate(swagger)).isNull()
    }

    @Test
    fun positiveCaseTinbox() {
        val swagger = getFixture("api_tinbox.yaml")
        assertThat(rule.validate(swagger)).isNull()
    }

    @Test
    fun positiveCaseNoMustViolations() {
        val swagger = getFixture("no_must_violations.yaml")
        assertThat(rule.validate(swagger)).isNull()
    }
}
