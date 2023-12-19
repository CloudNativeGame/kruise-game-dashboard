package handlers

import "github.com/gin-gonic/gin"

func GetSummary(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "summary",
	})
}
