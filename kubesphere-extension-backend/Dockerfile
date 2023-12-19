FROM golang:1.21.4-bookworm as builder

WORKDIR /app

COPY go.mod go.sum /app/
RUN go mod download
ADD ./ /app
RUN CGO_ENABLED=0 GOOS=linux go build -o kruise-game-dashboard-backend main.go

FROM alpine:3.14.2
COPY --from=builder /app/kruise-game-dashboard-backend /app/kruise-game-dashboard-backend
EXPOSE 8080
ENTRYPOINT ["/app/kruise-game-dashboard-backend"]
