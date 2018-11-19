import _ from 'lodash'
import React, { PureComponent } from 'react'
import { Image, ImageProps } from 'react-native'

export interface ImageWithLoadingProps extends ImageProps {
  backgroundColorFailed: string
  backgroundColorLoaded: string
  backgroundColorLoading: string
  onError?: ImageProps['onError']
  onLoad?: ImageProps['onLoad']
  onLoadEnd?: ImageProps['onLoadEnd']
  onLoadStart?: ImageProps['onLoadStart']
}

export class ImageWithLoading extends PureComponent<ImageWithLoadingProps> {
  static defaultProps = {
    onError: undefined,
    onLoad: undefined,
    onLoadEnd: undefined,
    onLoadStart: undefined,
  }

  state = {
    error: false,
    loading: true,
  }

  onLoad = _.memoize(
    (next: ImageProps['onLoad']): ImageProps['onLoad'] => e => {
      if (!this.mounted) return
      this.setState({ loading: false, error: false })
      if (typeof next === 'function') next(e)
    },
  )

  onLoadStart = _.memoize(
    (next: ImageProps['onLoadStart']): ImageProps['onLoadStart'] => () => {
      if (!this.mounted) return
      this.setState({ loading: true })
      if (typeof next === 'function') next()
    },
  )

  onLoadEnd = _.memoize(
    (next: ImageProps['onLoadEnd']): ImageProps['onLoadEnd'] => () => {
      if (!this.mounted) return
      this.setState({ loading: false })
      if (typeof next === 'function') next()
    },
  )

  onError = _.memoize(
    (next: ImageProps['onError']): ImageProps['onError'] => error => {
      if (!this.mounted) return
      this.setState({ loading: false, error: true })
      if (typeof next === 'function') next(error)
    },
  )

  private mounted = false

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const { error, loading } = this.state
    const {
      backgroundColorFailed,
      backgroundColorLoaded,
      backgroundColorLoading,
      onError,
      onLoad,
      onLoadEnd,
      onLoadStart,
      style,
      ...props
    } = this.props

    return (
      <Image
        {...props}
        onError={this.onError(onError)}
        onLoad={this.onLoad(onLoad)}
        onLoadEnd={this.onLoadEnd(onLoadEnd)}
        onLoadStart={this.onLoadStart(onLoadStart)}
        style={[
          style,
          {
            backgroundColor: error
              ? backgroundColorFailed
              : loading
              ? backgroundColorLoading
              : backgroundColorLoaded,
          },
        ]}
      />
    )
  }
}