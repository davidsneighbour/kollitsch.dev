<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />
  <xsl:template
    match="/atom:feed">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title><xsl:value-of select="atom:title" /> Feed</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <style type="text/css">
          * {
          box-sizing: border-box;
          }
          body {
          font-family: sans-serif;
          margin: 0;
          }
          aside {
          padding: 16px;
          background: lightgray;
          text-align: center;
          }
          .summary {
          max-width: 800px;
          margin: 32px auto;
          }
          h1 {
          font-size: 3rem;
          font-weight: 300;
          }
          .summary p {
          font-size: 1.25rem;
          font-weight: 300;
          }
          a {
          text-decoration: none;
          }
          article {
          max-width: 700px;
          margin: auto;
          padding: 0 24px;
          border-top: lightgray 1px solid;
          }
          dt {
          font-weight: bold;
          }
          dt::after {
          content: ": "
          }
        </style>
      </head>
      <body>
        <aside> Use the URL <a>
            <xsl:attribute name="href">
              <xsl:value-of select="atom:link[@rel='self']/@href" />
            </xsl:attribute>
            <xsl:value-of select="atom:link[@rel='self']/@href" />
          </a> to subscribe to
  this ATOM feed. </aside>
        <div>
          <section class="summary">
            <h1>
              <xsl:value-of select="atom:title" />
            </h1>
            <p>
              <xsl:value-of select="atom:subtitle" />
            </p>
            <a>
              <xsl:attribute name="href">
                <xsl:value-of select="atom:link[@rel='alternate']/@href" />
              </xsl:attribute>
  Visit Website &#x2192; </a>
          </section>
        </div>
        <xsl:for-each select="atom:entry">
          <xsl:sort select="atom:updated" order="descending" />
          <article>
            <h2>
              <a target="_blank">
                <xsl:attribute name="href">
                  <xsl:value-of select="atom:link" />
                </xsl:attribute>
                <xsl:value-of select="atom:title" />
              </a>
            </h2>
            <dl>
              <dt>Published Date</dt>
              <dd>
                <xsl:value-of select="atom:updated" />
              </dd>
              <xsl:if test="atom:category">
                <dt>Tags</dt>
                <xsl:for-each select="atom:category">
                  <dd>
                    <xsl:value-of select="@term" />
                  </dd>
                </xsl:for-each>
              </xsl:if>
            </dl>
          </article>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
