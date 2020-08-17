defmodule Regator.Repo do
  use Ecto.Repo,
    otp_app: :regator,
    adapter: Ecto.Adapters.Postgres
end
