<?xml version="1.0"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" indent="yes"/>
<xsl:param name="code"/>

<xsl:template match="/">
  <xsl:apply-templates select="//country[country_codes/cca3=$code]"/>
</xsl:template>

<xsl:template match="country">
  <p>
    <b>Official Name : </b> <xsl:value-of select="country_name/offic_name"/>
    <br/>
    <b> Capital : </b> <xsl:value-of select="capital"/>
  </p>
</xsl:template>

</xsl:stylesheet>

