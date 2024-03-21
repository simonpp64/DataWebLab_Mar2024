<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" />

    <!-- Template principal -->
    <xsl:template match="/">
        <html>
            <head>
                <title>
                    Petit Prince fragment
                </title>
            </head>
            <body style="background-color:white;">
                <!-- Appliquer le template pour l'en-tête -->
                <xsl:apply-templates select="//the_header" />
                <hr />
                <!-- Appliquer le template pour le corps -->
                <xsl:apply-templates select="//body" />
                <hr />
            </body>
        </html>
    </xsl:template>

    <!-- Template pour l'en-tête -->
    <xsl:template match="the_header">
        <table align="center" cellspacing="50">
            <tbody>
                <tr>
                    <td>
                        <!-- Appliquer le template pour la couverture -->
                        <xsl:apply-templates select="//cover" />
                    </td>
                    <td>
                        <!-- Appliquer les templates pour le titre, l'auteur et les informations de style -->
                        <xsl:apply-templates select="//title" />
                        <xsl:apply-templates select="//author" />
                        <xsl:apply-templates select="//styling_information" />
                    </td>
                </tr>
            </tbody>
        </table>
    </xsl:template>

    <!-- Template pour le corps -->
    <xsl:template match="body">
        <h3>Début du texte:</h3>
        <!-- Appliquer le template pour les 20 premiers paragraphes -->
        <xsl:apply-templates select="paragraph[position() &lt;= count(//paragraph[preceding-sibling::image][1]/preceding-sibling::paragraph)]" />
        <!-- Appliquer le template pour l'image -->
        <xsl:apply-templates select="image" />
        <!-- Appliquer le template pour les paragraphes du 21ème jusqu'à la fin -->
        <xsl:apply-templates select="paragraph[position() > count(//paragraph[preceding-sibling::image][1]/preceding-sibling::paragraph)]" />
        <h3>Fin du texte.</h3>
    </xsl:template>

    <!-- Template pour un paragraphe -->
    <xsl:template match="paragraph">
        <p style="text-align:justify;">
            <!-- Appliquer le template pour les phrases en français -->
            <xsl:apply-templates select="phrase[@language='francais']" />
            <br />
            <!-- Appliquer le template pour les phrases en hongrois -->
            <xsl:apply-templates select="phrase[@language='hongrois']" />
        </p>
    </xsl:template>

    <!-- Template pour une phrase en français -->
    <xsl:template match="phrase[@language='francais']">
        <xsl:choose>
            <xsl:when test="../@type='dialogue'">
                <tr>
                    <td width="50">
                        <img src="images/{@speaker}.png" />
                    </td>
                    <td>
                        <xsl:choose>
                            <xsl:when test="contains(., 'mouton')">
                                <font style="font-size: large; font-weight: bold;">
                                    <xsl:value-of select="." />
                                    <img src="images/moutonDessin.png" />
                                </font>
                            </xsl:when>
                            <xsl:otherwise>
                                <font>
                                    <xsl:value-of select="." />
                                </font>
                            </xsl:otherwise>
                        </xsl:choose>
                    </td>
                </tr>
            </xsl:when>
            <xsl:otherwise>
                <font>
                    <xsl:value-of select="." />
                </font>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <!-- Template pour une phrase en hongrois -->
    <xsl:template match="phrase[@language='hongrois']">
        <xsl:choose>
            <xsl:when test="../@type='dialogue'">
                <tr>
                    <td width="50">
                        <img src="images/{@speaker}.png" />
                    </td>
                    <td>
                        <font style="font-style: italic; color: brown;">
                            <xsl:value-of select="." />
                        </font>
                    </td>
                </tr>
            </xsl:when>
            <xsl:otherwise>
                <font style="font-style: italic; color: brown;">
                    <xsl:value-of select="." />
                </font>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <!-- Template pour un paragraphe de type dialogue -->
    <xsl:template match="paragraph[@type='dialogue']">
        <table align="center" width="90%">
            <tbody>
                <tr>
                    <td witdh="45%">
                        <table border="1" cellpadding="10" width="100%">
                            <tbody>
                                <!-- Appliquer le template pour les phrases en français -->
                                <xsl:apply-templates select="phrase[@language='francais']" />
                            </tbody>
                        </table>
                    </td>
                    <td width="10%"></td>
                    <td width="45%">
                        <table border="1" cellpadding="10" width="100%">
                            <tbody>
                                <!-- Appliquer le template pour les phrases en hongrois -->
                                <xsl:apply-templates select="phrase[@language='hongrois']" />
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </xsl:template>

    <!-- Template pour le titre -->
    <xsl:template match="title">
        <h1 style="text-align:center; color:blue;">
        <xsl:value-of select="." />
        </h1>
    </xsl:template>

    <!-- Template pour l'auteur -->
    <xsl:template match="author">
        <h2 style="text-align:center; font-style: italic;">
            <xsl:value-of select="." />
        </h2>
    </xsl:template>

    <!-- Template pour les informations de style -->
    <xsl:template match="styling_information">
        <blockquote>
            <font color="darkgreen">
                But du TP du
                <xsl:apply-templates select="date" />:
                <xsl:apply-templates select="styling_description" />
                <br />
                Auteurs:
                <xsl:apply-templates select="styled_by/style_manager[1]" />
                et
                <xsl:apply-templates select="styled_by/style_manager[2]" />
                ( <xsl:apply-templates select="styled_by/NoBinome" /> )
                <br />
                Email du responsable:
                <xsl:apply-templates select="email" />
            </font>
        </blockquote>
    </xsl:template>

    <!-- Template pour la couverture -->
    <xsl:template match="cover">
        <div align="center">
            <img>
                <xsl:attribute name="src">
                    <xsl:value-of select="@path" />
                </xsl:attribute>
            </img>
        </div>
    </xsl:template>

    <!-- Template pour une image -->
    <xsl:template match="image">
        <div align="center">
            <img>
                <xsl:attribute name="src">
                    <xsl:value-of select="@path" />
                </xsl:attribute>
            </img>
        </div>
    </xsl:template>
</xsl:stylesheet>
