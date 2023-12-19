package handlers

import "github.com/gin-gonic/gin"

func GetGameServers(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "gameserversets",
	})
}

func GetGameServerByName(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "gameserversets",
	})
}
