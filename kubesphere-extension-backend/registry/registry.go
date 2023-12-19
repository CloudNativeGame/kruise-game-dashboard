package registry

import (
	"github.com/openkruise/kruise-game/apis/v1alpha1"
	lister "github.com/openkruise/kruise-game/pkg/client/listers/apis/v1alpha1"
)

type Registry interface {
	GameServers() ([]v1alpha1.GameServer, error)
	GameServerSets() ([]v1alpha1.GameServerSet, error)

	GameServer(name string) (*v1alpha1.GameServer, error)
	GameServerSet(name string) (*v1alpha1.GameServerSet, error)
}

type ResourceRegistry struct {
	GameServerLister    lister.GameServerLister
	GameServerSetLister lister.GameServerSetLister
}

func (rr *ResourceRegistry) Run() {

}

func NewResourceRegistry() *ResourceRegistry {
	return &ResourceRegistry{}
}
