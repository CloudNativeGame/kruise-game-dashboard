package handlers

import "github.com/gin-gonic/gin"

func GetGameServerSets(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "gameserversets",
	})
}

func GetGameServerSetByName(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "gameserversets",
	})
}
