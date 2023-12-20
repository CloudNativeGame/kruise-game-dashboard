package main

import (
	"github.com/gin-gonic/gin"
	"github.com/kubesphere/kruise-game-dashboard-backend/handlers"
)

func main() {

	r := gin.Default()

	v1 := r.Group("/kapis/kruise-game-api.kubesphere.io/v1alpha1")
	{
		v1.GET("/cluster/overview", handlers.GetSummary)
		v1.GET("/gameserversets", handlers.GetGameServerSets)
		v1.GET("/gameservers", handlers.GetGameServers)
		v1.GET("/gameserverset/:name", handlers.GetGameServerSetByName)
		v1.GET("/gameserver/:name", handlers.GetGameServerByName)
	}

	r.GET("/healthz", handlers.Healthz)

	r.Run()
}
