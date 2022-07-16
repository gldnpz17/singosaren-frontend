function withLayout(Page, Layout) {
  function component (props) {
    return (
      <Layout>
        <Page {...props} />
      </Layout>
    )
  }

  return component
}

export default withLayout